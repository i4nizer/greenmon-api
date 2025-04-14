const env = require("../configs/env.config")
const Token = require("../models/token.model")
const { AppError } = require("../utils/app-error.util")
const { sign, verify, decode } = require("../utils/token.util")

/**
 * Note that the token hash will be the one inserted.
 * The token of the same user and type will be replaced.
 * There is no need to revoke in case.
 *
 * @param {Number} userId The user id to use as ref & part of payload.
 * @param {Object} payload The payload of the token.
 * @param {Number} life The expiry of the token in ms.
 * @param {"Access"|"Refresh"|"Api"} type The type of token to be stored.
 */
const createToken = async (userId, payload, type = "Access", life = env.accessLife) => {
	// create new token to insert
	const { tokenStr, tokenHash } = sign({ ...payload, userId }, type, life)

	// override existing token
	const tokenDoc = await Token.upsert(
		{
			hash: tokenHash,
			type,
			revoked: false,
			expiry: new Date(Date.now() + life),
			userId,
		},
		{ returning: true }
	)

	return { tokenStr, tokenDoc }
}

/**
 * Verifies the token provided and can opt to revoking it.
 *
 * @param {String} tokenStr The token to validate.
 * @param {"Access"|"Refresh"|"Api"} type The type of token to be stored.
 */
const verifyToken = async (tokenStr, type, revoke = false) => {
	// verify string first
	const { payload } = verify(tokenStr, type)
	const { userId } = payload

	// check if the token is revoked/blacklisted
	const tokenDoc = await Token.findOne({ where: { userId, type } })

	// not existing, its invalid
	if (!tokenDoc) throw new AppError(404, "Token not found.")

	// blacklisted
	if (tokenDoc.revoked) throw new AppError(403, "Token is already blacklisted.")

	// revoke if set
	if (revoke) {
		await tokenDoc.update({ revoked: true })
	}

	// all okay, give payload
	return { payload, tokenDoc }
}

/**
 * Revokes the token provided.
 *
 * @param {String} tokenStr The token to validate.
 * @param {"Access"|"Refresh"|"Api"} type The type of token to be stored.
 */
const revokeToken = async (tokenStr, type) => {
	// verify string first
	const { payload } = decode(tokenStr, type)
	const { userId } = payload

	// check if the token is revoked/blacklisted
	const tokenDoc = await Token.findOne({ where: { userId, type } })

	// not existing, its invalid
	if (!tokenDoc) throw new AppError(404, "Token not found.")

	// blacklisted
	if (tokenDoc.revoked) throw new AppError(403, "Token is already blacklisted.")

	// revoke
	await tokenDoc.update({ revoked: true })

	// all okay, give payload
	return { payload, tokenDoc }
}

module.exports = {
	createToken,
	verifyToken,
	revokeToken,
}
