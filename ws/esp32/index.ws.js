const env = require("../../configs/env.config");
const { logger } = require("../../utils/logger.util");
const { verifyToken, createToken, revokeToken } = require('../../services/token.service')
const { delWsEsp32, addWsEsp32 } = require("./util.ws");
const { attachWsEsp32Hooks } = require("./hook.ws");
const { sendWsEsp32InitialData } = require("./init.ws");
const { executeEsp32Handler } = require("./handler.ws");
const { Greenhouse } = require("../../models/index.model");
const { WebSocketClient } = require("../wsclient.ws");

//

/**
 * Parses the json msg and invokes necessary event handlers.
 * 
 * @param {WebSocketClient} wsClient This is the client that sends message.
 * @param {String} msg Usually a json string.
 */
const onWsEsp32Msg = (wsClient, msg) => {
	try {
		const { event, data = [], query } = JSON.parse(msg)
		logger.info(`Web socket received ${event} event from esp32 with ${query} and data[] of length ${data?.length}.`)
		// logger.info(`Web socket received ${event} event from esp32 with ${query} and data[${JSON.stringify(data)}].`)// of length ${data?.length}.`)
		
		executeEsp32Handler(wsClient, event, data, query)
	} catch (error) {
		logger.error(error, error)
	}
}

/**
 * Removes the web socket client from map.
 */
const onWsEsp32Close = (wsClient) => {
	logger.info("Web socket esp32 client disconnected.")
	delWsEsp32(wsClient)
}

/**
 * Handles authenticating web socket client.
 * 
 * @param {WebSocketClient} wsClient An unitialized web socket client that was verified.
 */
const onWsEsp32Auth = async (wsClient) => {
	logger.info("Web socket esp32 client successfully authenticated.")

	wsClient.ws.on("message", (msg) => onWsEsp32Msg(wsClient, msg))
	wsClient.ws.on("close", () => onWsEsp32Close(wsClient))

	// modify for logging
	const send = wsClient.ws.send
	wsClient.ws.send = (msg) => {
		const { event, data, query } = JSON.parse(msg)
		logger.info(`Web socket sent ${event} event to esp32 with ${query} and data[] of length ${data?.length}.`)
		return send.call(wsClient.ws, msg)
	}
	
	// send successful authentication
	wsClient.send("auth", [], "Create", true)	// cleans all files
	
	// send all initial data
	await sendWsEsp32InitialData(wsClient)
	
	// send init success
	wsClient.send("init", [], "Create", true)	// marks esp32 ready
	
	// mark as initialized
	wsClient.init = true
	addWsEsp32(wsClient)
}

/**
 * Creates new token, send to web socket client, then closes the connection.
 * 
 * @param {WebSocketClient} wsClient
 * @returns {Boolean} True if successfully created 
 */
const onWsEsp32TokenExpired = async (wsClient) => {
	try {
		// revoke
		const { payload } = await revokeToken(wsClient.key, "Api")
		const { userId, greenhouseId } = payload

		// create new token
		const { tokenStr: token } = await createToken(userId, { greenhouseId }, "Api", env.apiLife)

		// also save token as the greenhouse key
		await Greenhouse.update({ key: token }, { where: { id: greenhouseId } })

		// send error and token
		wsClient.send("error", [{ token }], 'Create', true)
		wsClient.ws.close()
		
		logger.info("Web socket esp32 successfully re-auth client.")
		return true

	} catch (error) {
		
		// send error & close
		wsClient.send("error", [error], "Create", true)
		wsClient.ws.close()
		
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

	const wsClient = new WebSocketClient(ws, apiKey, null, false)

	try {
		// check api key
		const { payload } = await verifyToken(apiKey, "Api", false)
		wsClient.payload = payload
		await onWsEsp32Auth(wsClient)

	} catch (error) {

		// token expired
		if (error?.message?.includes("expired")) {
			return onWsEsp32TokenExpired(wsClient)
		}

		// send error & close
		wsClient.send("error", [error], 'Create', true)
		wsClient.ws.close()
		
		logger.error("Web socket esp32 auth error occurred.", error)
		return
	} 
}

//

module.exports = {
	onWsEsp32Connect,
	attachWsEsp32Hooks,
}