


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
    if (ws.readyState != ws.OPEN || (data?.length <= 0 && query != 'Retrieve')) return;
    if (data.length >= 10) sendWsEsp32Chunked(ws, event, data, query, 30)
    else ws.send(formatWsEsp32Data(event, data, query))
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
    const firstData = data.splice(0, 2)
    const send = (d) => { if (ws.readyState == ws.OPEN) ws.send(formatWsEsp32Data(event, d, query))}
    send(firstData)
    
    for (let i = 0; i < data?.length; i += 2) {
        const dt = [data[i]]
        if (data[i+1]) dt.push(data[i+1])
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