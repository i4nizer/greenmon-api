const { logger } = require("../../utils/logger.util");
const { WebSocketClient } = require("../wsclient.ws");

//

/**
 * Stores all web socket clients.
 * @type {WebSocketClient[]}
 */
const _wsEsp32s = []

/**
 * Adds web socket client to the ws client map.
 * @param {WebSocketClient} wsClient This is the web socket client to be added.
 */
const addWsEsp32 = (wsClient) => _wsEsp32s.push(wsClient);

/**
 * Finds the web socket connection associated with the key.
 * @param {String} key This is the key to find the web socket client.
 * @returns {WebSocketClient[]} This is the web socket clients associated with the key.
 */
const getWsEsp32 = (key) => _wsEsp32s.filter(ws => ws.key == key);

/**
 * Adds web socket client to the ws client map.
 * @param {WebSocketClient} wsClient This is the web socket client to be removed.
 */
const delWsEsp32 = (wsClient) => {
    const newWsEsp32s = _wsEsp32s.filter(ws => ws.id != wsClient.id);
    _wsEsp32s.splice(0, _wsEsp32s.length);
    _wsEsp32s.push(...newWsEsp32s);
};

/**
 * Sends data in format parsable by esp32.
 *
 * @param {'auth'|'error'|'mcu'|'pin'|'sensor'|'output'|'actuator'|'input'|'schedule'|'threshold'|'condition'|'action'} event The web socket instance of the connected esp32.
 * @param {Array} data This is the data to be sent, usually updates.
 * @param {'Create'|'Retrieve'|'Update'|'Delete'} query Tells what type of request, CRUD.
 */
const sendWsEsp32 = (key, event, data, query = 'Update', force = false) => {
    const esp32s = getWsEsp32(key)
    
    esp32s.forEach(ws => {
        if (ws.ws.readyState != ws.ws.OPEN) {
            logger.warn(`Web socket failed sending ${event} event to esp32, connection not open.`)
            return;
        }
        else if (data?.length <= 0 && query != 'Retrieve') {
            logger.warn(`Web socket failed sending ${event} event to esp32, non-retrieve has no data.`)
            return;
        }
        
        if (data.length < 10) ws.send(event, data, query, force)
        else ws.sendChunked(event, data, query, 10, 30, force)
    })
}

//

module.exports = {
    addWsEsp32,
    getWsEsp32,
    delWsEsp32,
    sendWsEsp32,
}