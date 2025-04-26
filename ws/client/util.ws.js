


/**
 * Stores userId => { websocketclient }
 * @type {Map<Number, WebSocket>}
 */
const _wsClientMap = new Map()

/**
 * Adds web socket client to the ws client map.
 */
const addWsClient = (userId, ws) => _wsClientMap.set(userId, ws);

/**
 * Finds the web socket connection associated with the key.
 */
const getWsClient = (userId) => _wsClientMap.get(userId)

/**
 * Adds web socket client to the ws client map.
 */
const delWsClient = (userId) => _wsClientMap.delete(userId);

/**
 * Can be used to check if an client is online.
 *
 * @param {Number} userId This is the key used to which websocket client to send.
 * @returns {Boolean} True if the client with such api-key is connected.
 */
const checkWsClient = (userId) => _wsClientMap.has(userId)

/**
 * Sends data in format parsable by client.
 *
 * @param {WebSocket} ws This is the web socket instance.
 * @param {String} event The web socket instance of the connected client.
 * @param {Array} data This is the data to be sent, usually updates.
 * @param {'Create'|'Retrieve'|'Update'|'Delete'} query Tells what type of request, CRUD.
 */
const sendWsClient = (ws, event, data, query = 'Update') => {
    if (ws.readyState != ws.OPEN || (data?.length <= 0 && query != 'Retrieve')) return;
    ws.send(JSON.stringify({ event, data, query }))
}



module.exports = {
    addWsClient,
    getWsClient,
    delWsClient,
    checkWsClient,
    sendWsClient,
}