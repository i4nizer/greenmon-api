const { logger } = require("../../utils/logger.util");
const { WebSocketClient } = require("../wsclient.ws");
const { onCreateImage, onCreateImageRealtime } = require("./handlers/image.handler");


//

/**
 * Contains the handlers of events sent by esp32-cam.
 */
const _wsEsp32CamHandlerMap = new Map([
    ['image:Create', onCreateImage],
    ['image-realtime:Create', onCreateImageRealtime],
])

/**
 * @param {WebSocketClient} wsClient This is the web socket of esp32-cam that sent the data.
 * @param {String} event This is the event sent by esp32-cam.
 * @param {Array} data This is the array of data provided by esp32-cam.
 * @param {String} query This is the query part.
 */
const executeEsp32CamHandler = async (wsClient, event, data, query) => {
    const handler = _wsEsp32CamHandlerMap.get(`${event}:${query}`)
    if (handler) return await handler(wsClient, data).catch(error => logger.error(error, error))

    logger.warn(`Web socket esp32-cam sent <${event}:${query} ${data?.length}> records but no dedicated handler found.`)
}

//

module.exports = {
    executeEsp32CamHandler,
}