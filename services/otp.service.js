const env = require("../configs/env.config")
const OTP = require("../models/otp.model")
const { otp: genOtp } = require("../utils/otp.util")
const { hash } = require("../utils/hash.util")
const { AppError } = require("../utils/app-error.util")

/**
 * Hash the provided otp and insert to database.
 * This also replaces existing otp of the same type for the user.
 * In this way, there is no need to revoke previous token.
 *
 * @param {Number} userId User id that this otp will reference.
 * @param {"Account Verification"|"Password Reset"} type The type of usage for this token.
 */
const createOTP = async (userId, type = "Account Verification") => {
	// create new otp to insert
	const { otpNum, otpHash } = genOtp()

	// override existing otp
	const otpDoc = await OTP.upsert(
		{
			userId,
			type,
			hash: otpHash,
			revoked: false,
			expiry: new Date(Date.now() + env.otpLife),
		},
		{ returning: true }
	)

	return { otpNum, otpDoc }
}

/**
 * Checks if an otp is correct and defaults to revoking it.
 *
 * @param {Number} num The otp number that will be hashed.
 * @param {Number} userId User id that this otp reference.
 * @param {"Account Verification"|"Password Reset"} type The type of usage for this token.
 */
const verifyOTP = async (num, userId, type, revoke = true) => {
	// find otp & compare
	const otpDoc = await OTP.findOne({ where: { userId, type } })
	const otpHash = hash(num.toString())

	// otp must have expired
	if (!otpDoc) throw new AppError(400, "Otp has already expired.")

	// otp has been revoked (not expecting)
	if (otpDoc.revoked) throw new AppError(400, "Otp has been revoked.")

	// incorrect otp
	if (otpDoc.hash !== otpHash) throw new AppError(400, "The otp provided is incorrect.")

	// revoke the otp
	if (revoke) {
		await otpDoc.update({ revoked: true })
	}

	return { otpDoc }
}

module.exports = {
	createOTP,
	verifyOTP,
}
