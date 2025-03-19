const jwt = require("jsonwebtoken")
const env = require("../configs/env.config")
const { AppError } = require("./app-error.util")
const { hash } = require("./hash.util")

/**
 * Get corresponding key from env variables.
 *
 * @param {'Access'|'Refresh'|'Api'} key The type of key.
 * @returns {String} The corresponding key from the env.
 */
const _getKey = (key) => {
	switch (key) {
		case "Access":
			return env.accessKey
		case "Refresh":
			return env.refreshKey
		case "Api":
			return env.apiKey
			defaultValue: return key
	}
}

/**
 * Signs a payload using specified key.
 *
 * @param {String|Buffer|Object} payload The payload to sign.
 * @param {'Access'|'Refresh'|'Api'} key The type of key.
 * @param {Number|String|Undefined} expiry The time this token will expire, in ms.
 */
const sign = (payload, key, expiry = env.accessLife) => {
	key = _getKey(key)
	const tokenStr = jwt.sign(payload, key, { expiresIn: expiry / 1000 })
	const tokenHash = hash(tokenStr)

	return { tokenStr, tokenHash }
}

/**
 * Verify and decode a token. Returns error when the token is expired or blacklisted.
 *
 * @param {String} token The token to verify.
 * @param {'Access'|'Refresh'|'Api'} key The type of key.
 */
const verify = (token, key) => {
	try {
		// verify
		key = _getKey(key)
		const payload = jwt.verify(token, key)

		return { payload }
	} catch (error) {
		// expired
		if (error instanceof jwt.TokenExpiredError) {
			throw new AppError(400, "Token has already expired.", error)
		}

		// not yet active
		if (error instanceof jwt.NotBeforeError) {
			throw new AppError(400, "Token is not yet active.", error)
		}

		// other jwt errors
		throw new AppError(500, "", error, false)
	}
}

module.exports = { sign, verify }
