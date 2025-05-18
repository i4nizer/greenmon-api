const env = require("../../configs/env.config");
const { logger } = require("../../utils/logger.util");
const { attachWsEsp32CamHooks } = require('./hook.ws')
const { verifyToken, createToken, revokeToken } = require('../../services/token.service')
const { delWsEsp32Cam, addWsEsp32Cam } = require("./util.ws");
const { sendWsEsp32CamInitialData } = require("./init.ws");
const { executeEsp32CamHandler } = require("./handler.ws");
const { Camera } = require("../../models/index.model");
const { WebSocketClient } = require("../wsclient.ws");

//

/**
 * Parses the json msg and invokes necessary event handlers.
 * 
 * @param {WebSocketClient} wsClient This is the client that sends message.
 * @param {String} msg Usually a json string.
 */
const onWsEsp32CamMsg = (wsClient, msg) => {
    try {
        // logger.info(`Web socket received: ${msg}.`)
        
        // a realtime image binary
        const event = wsClient.payload?.interval < 60 ? 'image-realtime' : 'image'
        const query = 'Create'
    
        logger.info(`Web socket received ${event} event from esp32-cam with ${query} and data[] of length ${msg?.length}.`)
        // logger.info(`Web socket received ${event} event from esp32-cam with ${query} and data[${JSON.stringify(data)}].`)// of length ${data?.length}.`)      
        executeEsp32CamHandler(wsClient, event, msg, query)
        
    } catch (error) {
        logger.error(error, error)
    }
}

/**
 * Removes the web socket client from map.
 */
const onWsEsp32CamClose = (wsClient) => {
    logger.info("Web socket esp32-cam client disconnected.")
    delWsEsp32Cam(wsClient)
}

/**
 * Handles authenticating web socket client.
 * 
 * @param {WebSocketClient} wsClient An unitialized web socket client that was verified.
 */
const onWsEsp32CamAuth = async (wsClient) => {
    logger.info("Web socket esp32-cam client successfully authenticated.")

    wsClient.ws.on("message", (msg) => onWsEsp32CamMsg(wsClient, msg))
    wsClient.ws.on("close", () => onWsEsp32CamClose(wsClient))
    wsClient.ws.on("error", (err) => logger.error(err, err))

    // modify for logging
    const send = wsClient.ws.send
    wsClient.ws.send = (msg) => {
        const { event, data, query } = JSON.parse(msg)
        logger.info(`Web socket sent ${event} event to esp32-cam with ${query} and data[] of length ${data?.length}.`)
        return send.call(wsClient.ws, msg)
    }
    
    // send successful authentication
    wsClient.send("auth", [], "Create", true)	// cleans all files
    await new Promise(res => setTimeout(() => res(), 500))	// wait for esp32-cam to clean files
    
    // send all initial data
    await sendWsEsp32CamInitialData(wsClient)
    
    // send init success
    wsClient.send("init", [], "Create", true)	// marks esp32-cam ready
    
    // mark as initialized
    wsClient.init = true
    addWsEsp32Cam(wsClient)
}

/**
 * Creates new token, send to web socket client, then closes the connection.
 * 
 * @param {WebSocketClient} wsClient
 * @returns {Boolean} True if successfully created 
 */
const onWsEsp32CamTokenExpired = async (wsClient) => {
    try {
        // revoke
        const { payload } = await revokeToken(wsClient.key, "Api")
        const { userId, greenhouseId } = payload

        // create new token
        const { tokenStr: token } = await createToken(userId, { greenhouseId }, "Api", env.apiLife)

        // also save token as the camera key
        await Camera.update({ key: token }, { where: { id: greenhouseId }, source: "esp32-cam" })

        // send error and token
        wsClient.send("error", [{ token }], 'Create', true)
        wsClient.ws.close()
        
        logger.info("Web socket esp32-cam successfully re-auth client.")
        return true

    } catch (error) {
        
        // send error & close
        wsClient.send("error", [error], "Create", true)
        wsClient.ws.close()
        
        logger.error("Web socket esp32-cam auth error occurred.", error)
        return false
    }
}

/**
 * Handler for authenticating connecting web socket clients.
 */
const onWsEsp32CamConnect = async (ws, req) => {
    // get api key
    const apiKey = req.headers["x-api-key"];
    if (!apiKey) return ws.close(1008, "No api key provided.");
    logger.info("Web socket esp32-cam client connected.");

    const wsClient = new WebSocketClient(ws, apiKey, null, false)

    try {
        // check api key
        const { payload } = await verifyToken(apiKey, "Api", false)
        wsClient.payload = payload

        // find camera
        const cameraDoc = await Camera.findOne({ where: { key: apiKey } })
        wsClient.payload.interval = cameraDoc.interval

        await onWsEsp32CamAuth(wsClient)

    } catch (error) {

        // token expired
        if (error?.message?.includes("expired")) {
            return onWsEsp32CamTokenExpired(wsClient)
        }

        // send error & close
        wsClient.send("error", [error], 'Create', true)
        wsClient.ws.close()
        
        logger.error("Web socket esp32-cam auth error occurred.", error)
        return
    } 
}

//

module.exports = {
    onWsEsp32CamConnect,
    attachWsEsp32CamHooks,
}