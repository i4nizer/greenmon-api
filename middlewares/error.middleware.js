const env = require("../configs/env.config")
const { mail } = require("../utils/mail.util")
const { logger } = require("../utils/logger.util")
const { AppError } = require("../utils/app-error.util")
const { ValidationError } = require("joi")
const { craftUnexpectedErrorMail } = require("../configs/mail.config")

/**
 * Crafts and sends the mail to the developer.
 *
 * @param {Error} error The error to mail to the developer.
 */
const _mailDev = async (error) => {
	const { subject, text } = craftUnexpectedErrorMail(error)

	mail(env.devEmail, subject, text)
		// can't even mail the dev, pathetic
		.catch(err => logger.error("An unexpected error occurred and mail to dev failed.", err))
}

/**
 * Only validation and app errors are expected.
 */
const errorMiddleware = (err, req, res, next) => {
	// Log error
	logger.error(err.message, err)

	// User's fault
	if (err instanceof ValidationError) {
		return res.status(400).json({
			type: err.name,
			details: err.details,
		})
	}

	// App errors, expected
	if (err instanceof AppError) {
		
        // Notify developer of the non-operational error
		if (!err.operational) {
			_mailDev(err)
			
            return res.status(err.status).json({
				type: err.name,
				details: env.nodeEnv == "production" ? "Something went wrong, please try again." : err.message,
			})
		}

		return res.status(err.status).json({
			type: err.name,
			details: err.message,
		})
	}

	// Notify developer of the unexpected error
	_mailDev(err)

	// Unexpected error
	return res.status(500).json({
		type: err.name,
		details: env.nodeEnv == "production" ? "Something went wrong, please try again." : err.message,
	})
}

module.exports = { errorMiddleware }
