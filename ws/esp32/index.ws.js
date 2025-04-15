const { logger } = require("../../utils/logger.util");
const { verifyToken, revokeToken } = require('../../services/token.service')
const { delWsEsp32, addWsEsp32, formatWsEsp32Data } = require("./util.ws");
const { attachWsEsp32Hooks } = require("./hook.ws");
const { sendWsEsp32InitialData } = require("./init.ws");
const { executeEsp32Handler } = require("./handler.ws");



/**
 * Parses the json msg and invokes necessary event handlers.
 * 
 * @param {WebSocket} ws This is the client that sends message.
 * @param {String} msg Usually a json string.
 */
const onWsEsp32Msg = (ws, msg) => {
	logger.info(`Web socket received: ${msg}.`)
	const { event, data = [], query } = JSON.parse(msg)
	
	executeEsp32Handler(ws, event, data, query)
}

/**
 * Removes the web socket client from map.
 */
const onWsEsp32Close = (apiKey) => {
	logger.info("Web socket client disconnected.")
	if (delWsEsp32(apiKey)) return;
	logger.warn("Web socket anomaly, no web socket client found upon disconnection.")
}

/**
 * Handles authenticating web socket client.
 */
const onWsEsp32Auth = async (ws, apiKey, payload) => {
	logger.info("Web socket client successfully authenticated.")

	// override ws.send() for logging
	const send = ws.send
	ws.send = (data, options, callback) => {
		logger.info(`Web socket sent: ${data}.`)
		send.call(ws, data, options, callback)
	}

	ws.on("message", (msg) => onWsEsp32Msg(ws, msg))
	ws.on("close", () => onWsEsp32Close(apiKey))
	
	// send successful authentication
	ws.send(formatWsEsp32Data("auth", [], "Create"))	// cleans all files
	
	// send all initial data
	await sendWsEsp32InitialData(ws, payload)
		.catch(error => logger.error("Web socket error occurred while sending initial data.", error))
	
	// add after sending initial data to avoid update while initializing
	addWsEsp32(apiKey, ws)
}

/**
 * Creates new token, send to web socket client, then closes the connection.
 * 
 * @returns {Boolean} True if successfully created 
 */
const onWsEsp32TokenExpired = async (ws, apiKey, error) => {
	try {
		// revoke
		const { payload } = await revokeToken(apiKey, "Api")
		const { userId, greenhouseId } = payload

		// create new token
		const { tokenStr: token } = await createToken(userId, { greenhouseId }, "Api", env.apiLife)

		// send error and token
		ws.send(formatWsEsp32Data("error", [error, { token }], 'Create'))
		ws.close()
		
		logger.info("Web socket successfully re-auth client.")
		return true

	} catch (error) {
		
		// send error & close
		ws.send(formatWsEsp32Data("error", [error], 'Create'))
		ws.close()
		
		logger.error("Web socket auth error occurred.", error)
		return false
	}
}

/**
 * Handler for authenticating connecting web socket clients.
 */
const onWsEsp32Connect = async (ws, req) => {
	// get api key
	const apiKey = req.headers["x-api-key"];
	logger.info("Web socket client connected.");

	try {
		// check api key
		const { payload } = await verifyToken(apiKey, "Api", false)
		await onWsEsp32Auth(ws, apiKey, payload)

	} catch (error) {

		// token expired
		if (error?.message?.includes("expired")) {
			return onWsEsp32TokenExpired(ws, apiKey, error)
		}

		// send error & close
		ws.send(formatWsEsp32Data("error", [error], 'Create'))
		ws.close()
		
		logger.error("Web socket auth error occurred.", error)
		return
	} 
}



module.exports = {
	onWsEsp32Connect,
	attachWsEsp32Hooks,
}