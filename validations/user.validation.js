const Joi = require("joi")

/** Requires name, email, and password. */
const signUpSchema = Joi.object({
	name: Joi.string().min(3).max(30).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(8).required(),
})

/** Requires otp and userId. */
const accountVerificationOTPSchema = Joi.object({
	otp: Joi.string().length(6).required(),
	userId: Joi.number().integer().required(),
})

/** Requires userId, name, and email. */
const resendAccountVerificationOTPSchema = Joi.object({
	userId: Joi.number().integer().required(),
	name: Joi.string().min(3).max(30).required(),
	email: Joi.string().email().required(),
})

/** Requires email and password. */
const signInSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(8).required(),
})

/** Requires email. */
const forgotPasswordSchema = Joi.object({
	email: Joi.string().email().required(),
})

/** Requires email and otp. */
const resetPasswordOTPSchema = Joi.object({
	email: Joi.string().email().required(),
	otp: Joi.string().length(6).required(),
})

/** Requires email and new password. */
const resetPasswordSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(8).required(),
})

/** Requires new name. */
const updateUserSchema = Joi.object({
	name: Joi.string().min(3).max(30).required(),
})

module.exports = {
	signUpSchema,
	accountVerificationOTPSchema,
	resendAccountVerificationOTPSchema,
	signInSchema,
	forgotPasswordSchema,
	resetPasswordOTPSchema,
	resetPasswordSchema,
	updateUserSchema,
}
