const env = require("../../configs/env.config");
const { logger } = require("../../utils/logger.util");
const { verifyToken, createToken, revokeToken } = require('../../services/token.service')
const { delWsEsp32, addWsEsp32, formatWsEsp32Data } = require("./util.ws");
const { attachWsEsp32Hooks } = require("./hook.ws");
const { sendWsEsp32InitialData } = require("./init.ws");
const { executeEsp32Handler } = require("./handler.ws");
const { Greenhouse } = require("../../models/index.model");



/**
 * Parses the json msg and invokes necessary event handlers.
 * 
 * @param {WebSocket} ws This is the client that sends message.
 * @param {String} msg Usually a json string.
 */
const onWsEsp32Msg = (ws, msg) => {
	const { event, data = [], query } = JSON.parse(msg)
	logger.info(`Web socket received ${event} event from esp32 with ${query} and data[]of length ${data?.length}.`)
	// logger.info(`Web socket received ${event} event from esp32 with ${query} and data[${JSON.stringify(data)}].`)// of length ${data?.length}.`)
	
	executeEsp32Handler(ws, event, data, query)
}

/**
 * Removes the web socket client from map.
 */
const onWsEsp32Close = (apiKey) => {
	logger.info("Web socket esp32 client disconnected.")
	if (delWsEsp32(apiKey)) return;
	logger.warn("Web socket esp32 anomaly, no web socket client found upon disconnection.")
}

/**
 * Handles authenticating web socket client.
 */
const onWsEsp32Auth = async (ws, apiKey, payload) => {
	logger.info("Web socket esp32 client successfully authenticated.")

	ws.on("message", (msg) => onWsEsp32Msg(ws, msg))
	ws.on("close", () => onWsEsp32Close(apiKey))
	
	// send successful authentication
	ws.send(formatWsEsp32Data("auth", [], "Create"))	// cleans all files
	
	// send all initial data
	await sendWsEsp32InitialData(ws, payload)
	
	// send init success
	ws.send(formatWsEsp32Data("init", [], "Create"))	// marks esp32 ready
	
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

		// also save token as the greenhouse key
		await Greenhouse.update({ key: token }, { where: { id: greenhouseId } })

		// send error and token
		ws.send(formatWsEsp32Data("error", [error, { token }], 'Create'))
		ws.close()
		
		logger.info("Web socket esp32 successfully re-auth client.")
		return true

	} catch (error) {
		
		// send error & close
		ws.send(formatWsEsp32Data("error", [error], 'Create'))
		ws.close()
		
		logger.error("Web socket esp32 auth error occurred.", error)
		return false
	}
}

/**
 * Handler for authenticating connecting web socket clients.
 */
const onWsEsp32Connect = async (ws, req) => {
	// get api key
	const apiKey = req.headers["x-api-key"];
	if (!apiKey) return ws.close(1008, "No api key provided.");
	logger.info("Web socket esp32 client connected.");

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
		
		logger.error("Web socket esp32 auth error occurred.", error)
		return
	} 
}



module.exports = {
	onWsEsp32Connect,
	attachWsEsp32Hooks,
}