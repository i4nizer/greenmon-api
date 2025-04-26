const { verifyToken } = require("../../services/token.service");
const { logger } = require("../../utils/logger.util");
const { addWsClient, delWsClient } = require("./util.ws");
const { attachWsClientHooks } = require('./hook.ws')



/**
 * Removes the web socket client from map.
 */
const onWsClientClose = (userId) => {
	logger.info("Web socket client disconnected.")
	if (delWsClient(userId)) return;
	logger.warn("Web socket anomaly, no web socket client found upon disconnection.")
}

/**
 * Handles authenticating web socket client.
 */
const onWsClientAuth = async (ws, userId) => {
	logger.info("Web socket client successfully authenticated.")

	// override ws.send() for logging
	const send = ws.send
	ws.send = (data, options, callback) => {
		logger.info(`Web socket client sent: ${data}.`)
		send.call(ws, data, options, callback)
	}

	ws.on("close", () => onWsClientClose(userId))
	ws.on("message", (msg) => console.log(msg))
		
	// add after sending initial data to avoid update while initializing
	addWsClient(userId, ws)
}

/**
 * Handler for authenticating connecting web socket clients.
 * @param {WebSocket} ws This is the web socket instance.
 */
const onWsClientConnect = async (ws, req) => {
	// get access token
	const accessToken = req.query.token
    if (!accessToken) return ws.close(1008, "No access token provided.");

    try {
        // check access token
        const { payload } = await verifyToken(accessToken, 'Access')
        await onWsClientAuth(ws, payload.userId)

    } catch (error) {
        // not expected
        ws.close(1008, "Invalid token provided.")
        logger.error("WebSocket client connection failed: ", error)
    }
}



module.exports = {
    onWsClientConnect,
    attachWsClientHooks,
}