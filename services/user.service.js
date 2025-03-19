const env = require("../configs/env.config")
const OTP = require("../models/otp.model")
const User = require("../models/user.model")

const { mail } = require("../utils/mail.util")
const { hash } = require("../utils/hash.util")
const { AppError } = require("../utils/app-error.util")
const { createToken, verifyToken } = require("../services/token.service")
const { createOTP, verifyOTP } = require("../services/otp.service")

const {
	craftAccountConfirmationMail,
	craftPasswordResetMail,
	craftAccountConfirmedMail,
	craftSuccessfulSignInMail,
	craftSuccessfulSignOutMail,
	craftPasswordResetedMail,
} = require("../configs/mail.config")
const { logger } = require("../utils/logger.util")

/**
 * Just inserts a user to the database.
 * Throws an error if a user with the email exists.
 *
 * @param {String} name
 * @param {String} email
 * @param {String} password This password will be hashed.
 */
const createUser = async (name, email, password) => {
	// find user
	const emailDoc = await User.findOne({ where: { email } })

	// email exists
	if (emailDoc) throw new AppError(400, "This email is already in use.")

	// can insert, email okay
	const userDoc = await User.create({
		name,
		email,
		password: hash(password),
		verified: false,
		disabled: false,
	})

	return { userDoc }
}

/**
 * Throws an error if the user is not found, unverified, or disabled.
 *
 * @param {Object} filter The filter to use to find the user.
 */
const retrieveValidUser = async (filter) => {
	// find user
	const userDoc = await User.findOne({ where: filter })

	// not found
	if (!userDoc) throw new AppError(404, "User not found")

	// disabled
	if (userDoc.disabled) throw new AppError(403, "User currently disabled.")

	// not verified
	if (!userDoc.verified) throw new AppError(400, "User is not yet verified.")

	return { userDoc }
}

/**
 * Creates an otp and mails to the specified email.
 * Note that this doesn't check if the user exists.
 *
 * @param {Number} userId
 * @param {String} name
 * @param {String} email
 * @param {"Account Verification"|"Password Reset"} type
 */
const mailUserOTP = async (userId, name, email, type) => {
	// create otp based on type
	const { otpNum, otpDoc } = await createOTP(userId, type)

	// create email message
	const { subject, text } =
		type == "Account Verification" ? craftAccountConfirmationMail(name, otpNum) : craftPasswordResetMail(name, otpNum)

	// mail the otp message
	mail(email, subject, text).catch((err) => logger.error(err))

	// success, return data
	return { otpNum, otpDoc }
}

/**
 * Creates user and mails otp for verification.
 *
 * @param {String} name
 * @param {String} email
 * @param {String} password This will be hashed.
 */
const signUpUser = async (name, email, password) => {
	// create user
	const { userDoc } = await createUser(name, email, password)

	// create & email otp
	const { otpNum, otpDoc } = await mailUserOTP(userDoc.id, name, email, "Account Verification")

	return { otpNum, otpDoc, userDoc }
}

/**
 * Verifies the user if the otp is correct.
 *
 * @param {Number} userId
 * @param {Number} otpNum
 */
const verifyUser = async (userId, otpNum) => {
	// find user
	const userDoc = await User.findByPk(userId)
	console.log(userId, otpNum, userDoc)

	// not found
	if (!userDoc) throw new AppError(404, "User not found.")

	// disabled
	if (userDoc.disabled) throw new AppError(403, "User is currently disabled.")

	// already verified
	if (userDoc.verified) throw new AppError(400, "User is already verified.")

	// compare & revoke correct otp
	const { otpDoc } = await verifyOTP(otpNum, userId, "Account Verification", true)

	// update user as verified
	await userDoc.update({ verified: true })

	// email verification success
	const { subject, text } = craftAccountConfirmedMail(userDoc.name)
	mail(userDoc.email, subject, text).catch((err) => logger.error(err))

	// verify success
	return { otpDoc, userDoc }
}

/**
 * Creates tokens if the password is correct.
 *
 * @param {String} email
 * @param {String} password
 */
const signInUser = async (email, password) => {
	// find valid user
	const { userDoc } = await retrieveValidUser({ email })
	const userId = userDoc.id

	// incorrect password
	const passwordHash = hash(password)
	if (userDoc.password != passwordHash) throw new AppError(400, "Incorrect password.")

	// create access & refresh token
	const { tokenStr: accessToken } = await createToken(userId, { userId }, "Access", env.accessLife)
	const { tokenStr: refreshToken } = await createToken(userId, { userId }, "Refresh", env.refreshLife)

	// email sign in success
	const { subject, text } = craftSuccessfulSignInMail(userDoc.name)
	mail(userDoc.email, subject, text).catch((err) => logger.error(err))

	// return data
	return { userDoc, accessToken, refreshToken }
}

/**
 * Signs out the user by revoking its access and refresh tokens.
 *
 * @param {Number} userId
 * @param {String} accessToken
 * @param {String} refreshToken
 * @param {Boolean} revoke True will verify the tokens again and revoke their doc.
 */
const signOutUser = async (userId, accessToken, refreshToken, revoke = false) => {
	// find user
	const { userDoc } = await retrieveValidUser({ id: userId })

	// validate & revoke tokens
	if (revoke) {
		const {} = await verifyToken(accessToken, "Access", true)
		const {} = await verifyToken(refreshToken, "Refresh", true)
	}

	// email sign out success
	const { subject, text } = craftSuccessfulSignOutMail(userDoc.name)
	mail(userDoc.email, subject, text).catch((err) => logger.error(err))

	// return data
	return { userDoc }
}

/**
 * Creates password-reset otp and emails to the user.
 *
 * @param {String} email
 */
const forgotUserPassword = async (email) => {
	// find user
	const { userDoc } = await retrieveValidUser({ email })

	// create reset password otp
	const { otpNum, otpDoc } = await createOTP(userDoc.id, "Password Reset")

	// email otp
	const { subject, text } = craftPasswordResetMail(userDoc.name, otpNum)
	mail(email, subject, text).catch((err) => logger.error(err))

	// return data
	return { userDoc, otpNum, otpDoc }
}

/**
 * Reset is only allowed if there is a revoked password-reset otp for the user.
 *
 * @param {N} userId
 * @param {String} password The new password.
 */
const resetUserPassword = async (userId, password) => {
	// find valid user & otp
	const { userDoc } = await retrieveValidUser({ id: userId })
	const otpDoc = await OTP.findOne({ where: { userId, revoked: true } })

	// not allowed, not otp verified
	if (!otpDoc) throw new AppError(403, "User is not allowed to change password.")

	// remove the otp
	await otpDoc.destroy()

	// change user password
	await userDoc.update({ password: hash(password) })

	// email reset success
	const { subject, text } = craftPasswordResetedMail(userDoc.name)
	mail(userDoc.email, subject, text).catch((err) => logger.error(err))

	// return data
	return { userDoc, otpDoc }
}

module.exports = {
	createUser,
	retrieveValidUser,
	mailUserOTP,
	signUpUser,
	verifyUser,
	signInUser,
	signOutUser,
	forgotUserPassword,
	resetUserPassword,
}
