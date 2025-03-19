const env = require("../configs/env.config")
const winston = require("winston")
const DailyRotateFile = require("winston-daily-rotate-file")
const { combine, errors, timestamp, json, prettyPrint, printf } = winston.format



/**
 * Defines where the logs go.
 */
const _transports = [
	new DailyRotateFile({
		filename: "logs/app-%DATE%.log",
		datePattern: "YYYY-MM-DD",
		maxSize: "20m",
		maxFiles: "14d",
		level: "debug",
	}),
	new DailyRotateFile({
		filename: "logs/error-%DATE%.log",
		datePattern: "YYYY-MM-DD",
		maxSize: "20m",
		maxFiles: "14d",
		level: "error",
		format: combine(
			errors({ stack: true }),
			timestamp(),
			json(),
			prettyPrint()
		),
	}),
]

/**
 * Log in console only in development.
 */
if (env.nodeEnv === "development") {
	_transports.push(
		new winston.transports.Console({
			format: printf(({ message }) => message),
		})
	)
}

/**
 * A simple logger that logs on console and file.
 */
const logger = winston.createLogger({
	level: "debug",
	format: combine(timestamp(), json()),
	transports: _transports,
})



module.exports = { logger }
