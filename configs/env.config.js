require('dotenv').config()



/**
 * Injected variables from .env file.
 */
const env = {
	// Defines type of environment
	nodeEnv: process.env.NODE_ENV,

    // This api's information
	port: parseFloat(process.env.PORT),
	clientDomain: process.env.CLIENT_DOMAIN,

	// Database credentials
	dbHost: process.env.DB_HOST,
	dbPort: parseFloat(process.env.DB_PORT),
	dbDialect: process.env.DB_DIALECT,
	dbName: process.env.DB_NAME,
	dbUser: process.env.DB_USER,
	dbPassword: process.env.DB_PASSWORD,

	// Developer's email
	devEmail: process.env.DEV_EMAIL,

    // This api's email
	apiEmail: process.env.API_EMAIL,
	apiEmailPassword: process.env.API_EMAIL_PASSWORD,
	
	// Expiries in milliseconds
	otpLife: parseFloat(process.env.OTP_LIFE),
	apiLife: parseFloat(process.env.API_LIFE),
	accessLife: parseFloat(process.env.ACCESS_LIFE),
	refreshLife: parseFloat(process.env.REFRESH_LIFE),
	
	// Just the config for the otp
	otpDigits: parseFloat(process.env.OTP_DIGITS),

	// Password config
	resetPasswordDuration: parseFloat(process.env.RESET_PASSWORD_DURATION),

	// Private keys for jsonwebtoken
	apiKey: process.env.API_KEY,
	accessKey: process.env.ACCESS_KEY,
	refreshKey: process.env.REFRESH_KEY,
}



module.exports = env