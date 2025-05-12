const { verifyToken } = require("../../services/token.service");
const { logger } = require("../../utils/logger.util");
const { addWsClient, delWsClient } = require("./util.ws");
const { attachWsClientHooks } = require('./hook.ws');
const { WebSocketClient } = require("../wsclient.ws");

//

/**
 * Removes the web socket client from map.
 * 
 * @param {WebSocketClient} wsClient
 */
const onWsClientClose = (wsClient) => {
	logger.info("Web socket client disconnected.")
	delWsClient(wsClient)
}

/**
 * Handles authenticating web socket client.
 * 
 * @param {WebSocketClient} wsClient
 */
const onWsClientAuth = async (wsClient) => {
	logger.info("Web socket client successfully authenticated.")

	wsClient.ws.on("close", () => onWsClientClose(wsClient))
	// wsClient.ws.on("message", (msg) => console.log(msg)) // not bidirectional

	// modify for logging
	const send = wsClient.ws.send.bind(wsClient.ws)
	wsClient.ws.send = (msg) => {
		const { event, data, query } = JSON.parse(msg)
		logger.info(`Web socket sent ${event} event to client with ${query} and data[] of length ${data?.length}.`)
		return send(msg)
	}

	// add after sending initial data to avoid update while initializing
	wsClient.init = true
	addWsClient(wsClient)
}

/**
 * Handler for authenticating connecting web socket clients.
 * @param {WebSocket} ws This is the web socket instance.
 */
const onWsClientConnect = async (ws, req) => {
	// get access token
	const accessToken = req.query.token
    if (!accessToken) return ws.close(1008, "No access token provided.");

    const wsClient = new WebSocketClient(ws, null, null, false)

    try {
        // check access token
        const { payload } = await verifyToken(accessToken, 'Access')
        wsClient.key = payload.userId
        wsClient.payload = payload
        await onWsClientAuth(wsClient)

    } catch (error) {

        // not expected
        ws.close(1008, "Invalid token provided.")
        logger.error("WebSocket client connection failed: ", error)
    }
}

//

module.exports = {
    onWsClientConnect,
    attachWsClientHooks,
}