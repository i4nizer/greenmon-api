const { logger } = require("../../utils/logger.util");



/**
 * Stores api-key => { websocketclient }
 * @type {Map<String, WebSocket>}
 */
const _wsEsp32Map = new Map()

/**
 * Converts object to string to be sent to esp32.
 * @param {'auth'|'error'|'mcu'|'pin'|'sensor'|'output'|'actuator'|'input'|'schedule'|'threshold'|'condition'|'action'} event The web socket instance of the connected esp32.
 * @param {Array} data An array of json objects.
 * @param {'Create'|'Retrieve'|'Update'|'Delete'} query Tells what type of request, CRUD.
 */
const formatWsEsp32Data = (event, data, query) => {
	const json = { event, data, query }
	return JSON.stringify(json)
}

/**
 * Adds web socket client to the ws client map.
 */
const addWsEsp32 = (apiKey, ws) => _wsEsp32Map.set(apiKey, ws);

/**
 * Finds the web socket connection associated with the key.
 */
const getWsEsp32 = (apiKey) => _wsEsp32Map.get(apiKey)

/**
 * Adds web socket client to the ws client map.
 */
const delWsEsp32 = (apiKey) => _wsEsp32Map.delete(apiKey);

/**
 * Can be used to check if an esp32 is online.
 *
 * @param {String} apiKey This is the key used to which websocket client to send.
 * @returns {Boolean} True if the client with such api-key is connected.
 */
const checkWsEsp32 = (apiKey) => _wsEsp32Map.has(apiKey)

/**
 * Sends data in format parsable by esp32.
 *
 * @param {WebSocket} ws This is the web socket instance.
 * @param {'auth'|'error'|'mcu'|'pin'|'sensor'|'output'|'actuator'|'input'|'schedule'|'threshold'|'condition'|'action'} event The web socket instance of the connected esp32.
 * @param {Array} data This is the data to be sent, usually updates.
 * @param {'Create'|'Retrieve'|'Update'|'Delete'} query Tells what type of request, CRUD.
 */
const sendWsEsp32 = (ws, event, data, query = 'Update') => {
    if (ws.readyState != ws.OPEN) {
        logger.warn(`Web socket failed sending ${event} event to esp32, connection not open.`)
        return;
    }
    else if (data?.length <= 0 && query != 'Retrieve') {
        logger.warn(`Web socket failed sending ${event} event to esp32, non-retrieve has no data.`)
        return;
    }
    
    if (data.length < 10) {
        ws.send(formatWsEsp32Data(event, data, query))
        logger.info(`Web socket sent ${event} event to esp32 with ${query} and data[] of length ${data?.length}.`)
        // logger.info(`Web socket sent ${event} event to esp32 with ${query} and data[${JSON.stringify(data)}].`)// of length ${data?.length}.`)
    }
    else sendWsEsp32Chunked(ws, event, data, query, 30)
}

/**
 * Sends data in an interval, with the specified delay.
 * 
 * @param {WebSocket} ws This is the web socket client to send on.
 * @param {'mcu'|'pin'|'sensor'|'output'|'actuator'|'input'|'schedule'|'threshold'|'condition'|'action'} event The web socket instance of the connected esp32.
 * @param {Array} data This is the data to be sent, usually updates.
 * @param {'Create'|'Retrieve'|'Update'|'Delete'} query Tells what type of request, CRUD.
 * @param {Number} delay The delay of sending each data.
 */
const sendWsEsp32Chunked = (ws, event, data, query, delay = 30) => {
    const firstData = data.splice(0, 10)
    const send = (d) => {
        if (ws.readyState == ws.OPEN) {
            ws.send(formatWsEsp32Data(event, d, query))
            logger.info(`Web socket sent ${event} event to esp32 with ${query} and data[] of length ${d?.length}.`)
        }
        else logger.warn(`Web socket failed sending ${event} event to esp32.`)
    }
    send(firstData)
    
    for (let i = 0; i < data?.length; i += 10) {
        const dt = [data[i]]
        if (data[i+1]) dt.push(data[i+1])
        if (data[i+2]) dt.push(data[i+2])
        if (data[i+3]) dt.push(data[i+3])
        if (data[i+4]) dt.push(data[i+4])
        if (data[i+5]) dt.push(data[i+5])
        if (data[i+6]) dt.push(data[i+6])
        if (data[i+7]) dt.push(data[i+7])
        if (data[i+8]) dt.push(data[i+8])
        if (data[i+9]) dt.push(data[i+9])
        setTimeout(() => send(dt), delay * i)
    }
}



module.exports = {
    addWsEsp32,
    getWsEsp32,
    delWsEsp32,
    checkWsEsp32,
    formatWsEsp32Data,
    sendWsEsp32,
    sendWsEsp32Chunked,
}