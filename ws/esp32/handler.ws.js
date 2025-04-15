const { logger } = require("../../utils/logger.util");
const { onCreateReading } = require("./handlers/reading.handler")



/**
 * Contains the handlers of events sent by esp32.
 */
const _wsEsp32HandlerMap = new Map([
    ['mcu:Create', onCreateReading],
])


/**
 * @param {WebSocket} ws This is the web socket of esp32 that sent the data.
 * @param {String} event This is the event sent by esp32.
 * @param {Array} data This is the array of data provided by esp32.
 * @param {String} query This is the query part.
 */
const executeEsp32Handler = async (ws, event, data, query) => {
    const handler = _wsEsp32HandlerMap.get(`${event}:${query}`)
    if (handler) return await handler(ws, data).catch(error => logger.error(error))

    logger.warn(`Web socket esp32 sent ${event}:${query} ${data?.length} records but no dedicated handler found.`)
}



module.exports = {
    executeEsp32Handler,
}