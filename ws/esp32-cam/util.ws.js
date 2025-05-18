const { logger } = require("../../utils/logger.util");
const { WebSocketClient } = require("../wsclient.ws");

//

/**
 * Stores all web socket clients.
 * @type {WebSocketClient[]}
 */
const _wsEsp32Cams = []

/**
 * Adds web socket client to the ws client map.
 * @param {WebSocketClient} wsClient This is the web socket client to be added.
 */
const addWsEsp32Cam = (wsClient) => _wsEsp32Cams.push(wsClient);

/**
 * Finds the web socket connection associated with the key.
 * 
 * @param {String} key This is the key to find the web socket client.
 * @returns {WebSocketClient[]} This is the web socket clients associated with the key.
 */
const getWsEsp32Cam = (key) => _wsEsp32Cams.filter(ws => ws.key == key);

/**
 * Adds web socket client to the ws client map.
 * @param {WebSocketClient} wsClient This is the web socket client to be removed.
 */
const delWsEsp32Cam = (wsClient) => {
    const newWsEsp32Cams = _wsEsp32Cams.filter(ws => ws.id == wsClient.id);
    _wsEsp32Cams.splice(0, _wsEsp32Cams.length);
    _wsEsp32Cams.push(...newWsEsp32Cams);
};

/**
 * Sends data in format parsable by esp32-cam.
 *
 * @param {'auth'|'error'|'mcu'|'pin'|'sensor'|'output'|'actuator'|'input'|'schedule'|'threshold'|'condition'|'action'} event The web socket instance of the connected esp32-cam.
 * @param {Array} data This is the data to be sent, usually updates.
 * @param {'Create'|'Retrieve'|'Update'|'Delete'} query Tells what type of request, CRUD.
 */
const sendWsEsp32Cam = (key, event, data, query = 'Update', force = false) => {
    const esp32Cams = getWsEsp32Cam(key)
    
    esp32Cams.forEach(ws => {
        if (ws.ws.readyState != ws.ws.OPEN) {
            logger.warn(`Web socket failed sending ${event} event to esp32-cam, connection not open.`)
            return;
        }
        else if (data?.length <= 0 && query != 'Retrieve') {
            logger.warn(`Web socket failed sending ${event} event to esp32-cam, non-retrieve has no data.`)
            return;
        }
        
        if (data.length < 10) ws.send(event, data, query, force)
        else ws.sendChunked(event, data, query, 10, 30, force)
    })
}

//

module.exports = {
    addWsEsp32Cam,
    getWsEsp32Cam,
    delWsEsp32Cam,
    sendWsEsp32Cam,
}