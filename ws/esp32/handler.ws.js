const { logger } = require("../../utils/logger.util");
const { WebSocketClient } = require("../wsclient.ws");
const { onUpdateAction } = require("./handlers/action.handler");
const { onCreateAlert } = require("./handlers/alert.handler");
const { onUpdateCondition } = require("./handlers/condition.handler");
const { onCreateImage, onCreateImageChunk, onUpdateImage } = require("./handlers/image.handler");
const { onUpdateInput } = require("./handlers/input.handler");
const { onCreateReading } = require("./handlers/reading.handler");
const { onUpdateSchedule } = require("./handlers/schedule.handler");
const { onUpdateSensor } = require("./handlers/sensor.handler");
const { onUpdateThreshold } = require("./handlers/threshold.handler");

//

/**
 * Contains the handlers of events sent by esp32.
 */
const _wsEsp32HandlerMap = new Map([
    ['action:Update', onUpdateAction],
    ['alert:Create', onCreateAlert],
    ['condition:Update', onUpdateCondition],
    ['input:Update', onUpdateInput],
    ['reading:Create', onCreateReading],
    ['schedule:Update', onUpdateSchedule],
    ['sensor:Update', onUpdateSensor],
    ['threshold:Update', onUpdateThreshold],
    ['image:Create', onCreateImage],
    ['image:Update', onUpdateImage],
    ['image-chunk:Create', onCreateImageChunk],
])

/**
 * @param {WebSocketClient} wsClient This is the web socket of esp32 that sent the data.
 * @param {String} event This is the event sent by esp32.
 * @param {Array} data This is the array of data provided by esp32.
 * @param {String} query This is the query part.
 */
const executeEsp32Handler = async (wsClient, event, data, query) => {
    const handler = _wsEsp32HandlerMap.get(`${event}:${query}`)
    if (handler) return await handler(wsClient, data).catch(error => logger.error(error, error))

    logger.warn(`Web socket esp32 sent <${event}:${query} ${data?.length}> records but no dedicated handler found.`)
}

//

module.exports = {
    executeEsp32Handler,
}