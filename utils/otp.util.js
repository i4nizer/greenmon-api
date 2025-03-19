const env = require("../configs/env.config")
const { hash } = require("./hash.util")



/** @returns {Number} A random integer. */
const _randomInt = () => Math.floor(Math.random() * 10);

/**
 * Generate a random otp.
 *
 * @param {Number} digits Determines the count of numbers.
 */
const otp = (digits = env.otpDigits) => {
	// get random digits
	let num = 0;

	for (let i = 0; i < digits; i++) {
		num = num * 10 + _randomInt();
	}

	return {
		otpNum: num,
		otpHash: hash(num.toString()),
	}
}



module.exports = { otp }
