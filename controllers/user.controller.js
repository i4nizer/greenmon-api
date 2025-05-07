const env = require("../configs/env.config")
const { verifyOTP } = require("../services/otp.service")
const { createToken } = require("../services/token.service")
const {
	retrieveValidUser,
	mailUserOTP,
	signUpUser,
	verifyUser,
	signInUser,
	signOutUser,
	forgotUserPassword,
	resetUserPassword,
} = require("../services/user.service")

//

/** Sign up by creating the user & mailing otp. */
const postSignUp = async (req, res, next) => {
	try {
		const { name, email, password } = req.body
		const { userDoc } = await signUpUser(name, email, password)

		res.json({
			text: "User signed up successfully.",
			user: { ...userDoc.get(), password: null }, // Use Sequelize's `get()` method
		})
	} catch (error) {
		next(error)
	}
}

/** Verifies a user by provided otp. */
const postAccountVerificationOTP = async (req, res, next) => {
	try {
		const { userId, otp } = req.body
		const { otpDoc } = await verifyUser(userId, otp)

		res.json({ text: "User verified successfully." })
	} catch (error) {
		next(error)
	}
}

/** Just re-mails new otp. */
const postResendAccountVerificationOTP = async (req, res, next) => {
	try {
		const { userId, name, email } = req.body
		const { otpNum, otpDoc } = await mailUserOTP(userId, name, email, "Account Verification")

		res.json({ text: "New OTP verification code emailed." })
	} catch (error) {
		next(error)
	}
}

/** Sign in by sending token if password is correct. */
const postSignIn = async (req, res, next) => {
	try {
		const { email, password } = req.body
		const { userDoc, accessToken, refreshToken } = await signInUser(email, password)

		res.json({
			text: "User signed-in successfully.",
			user: { ...userDoc.get(), password: null }, // Use Sequelize's `get()` method
			accessToken,
			refreshToken,
		})
	} catch (error) {
		next(error)
	}
}

/** Rotates tokens using refresh token that is revoked after. */
const postRotateToken = async (req, res, next) => {
	try {
		await req.refreshTokenDoc.update({ revoked: true }) // Use Sequelize's `update()` method

		const { userId } = req.refreshTokenPayload
		const { tokenStr: accessToken } = await createToken(userId, { userId }, "Access", env.accessLife)
		const { tokenStr: refreshToken } = await createToken(userId, { userId }, "Refresh", env.refreshLife)

		res.json({
			text: "Tokens rotated successfully.",
			accessToken,
			refreshToken,
		})
	} catch (error) {
		next(error)
	}
}

/** Signs out a user by revoking its tokens. */
const postSignOut = async (req, res, next) => {
	try {
		const { refreshTokenPayload, accessToken, refreshToken } = req
		const { userId } = refreshTokenPayload
		const { userDoc } = await signOutUser(userId, accessToken, refreshToken)

		res.json({ text: "User signed out successfully." })
	} catch (error) {
		next(error)
	}
}

/** Sends an otp to the email of the user */
const postForgotPassword = async (req, res, next) => {
	try {
		const { email } = req.body
		const { userDoc } = await forgotUserPassword(email)

		res.json({ text: "OTP verification sent to email." })
	} catch (error) {
		next(error)
	}
}

/** Just re-mails new forgot password otp. */
const postResetPasswordOTP = async (req, res, next) => {
	try {
		const { email, otp } = req.body
		const { userDoc } = await retrieveValidUser({ email })
		const userId = userDoc.id

		const { otpDoc } = await verifyOTP(otp, userId, "Password Reset", true)
		otpDoc.expiresAt = new Date(Date.now() + env.resetPasswordDuration)
		await otpDoc.save()

		const minutes = env.resetPasswordDuration / 60000
		res.json({ text: `OTP verified successfully, you may change your password in under ${minutes}minutes.` })
	} catch (error) {
		next(error)
	}
}

/** Changes the user's password with the otp. */
const postResetPassword = async (req, res, next) => {
	try {
		const { email, password } = req.body
		const { userDoc } = await retrieveValidUser({ email })
		const userId = userDoc.id

		const {} = await resetUserPassword(userId, password)

		res.json({ text: "Password reset successfully." })
	} catch (error) {
		next(error)
	}
}

/** Changes changeable fields of the user. */
const patchUser = async (req, res, next) => {
	try {
		const { name } = req.body
		const { userId } = req.accessTokenPayload
		const { userDoc } = await retrieveValidUser({ id: userId }) // Use Sequelize's `id` field

		await userDoc.update({ name }) // Use Sequelize's `update()` method

		res.json({ text: "User updated successfully." })
	} catch (error) {
		next(error)
	}
}

//

module.exports = {
	postSignUp,
	postAccountVerificationOTP,
	postResendAccountVerificationOTP,
	postSignIn,
	postRotateToken,
	postSignOut,
	postForgotPassword,
	postResetPasswordOTP,
	postResetPassword,
	patchUser,
}
