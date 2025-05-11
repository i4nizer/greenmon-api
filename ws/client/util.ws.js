const { logger } = require("../../utils/logger.util");
const { WebSocketClient } = require("../wsclient.ws")

//

/**
 * Stores web socket instances
 * @type {WebSocketClient[]} An array of web socket instances.
 */
const _wsClients = []

/**
 * Adds web socket client to the ws client map.
 * @param {WebSocketClient} wsClient
 */
const addWsClient = (wsClient) => _wsClients.push(wsClient);

/**
 * Finds the web socket connection associated with the key.
 */
const getWsClient = (userId) => _wsClients.filter(ws => ws.key == userId)

/**
 * Adds web socket client to the ws client map.
 * @param {WebSocketClient} wsClient
 */
const delWsClient = (wsClient) => {
    const newWsClients = _wsClients.filter(ws => ws.id != wsClient.id)
    _wsClients.splice(0, _wsClients.length)
    _wsClients.push(...newWsClients)
}

/**
 * Sends data in format parsable by client.
 *
 * @param {String} key This is the key, the userId.
 * @param {String} event The event to be sent.
 * @param {Array} data This is the data to be sent, usually updates.
 * @param {'Create'|'Retrieve'|'Update'|'Delete'} query Tells what type of request, CRUD.
 */
const sendWsClient = (key, event, data, query = 'Update') => {
    const wsClients = getWsClient(key)

    wsClients.forEach(ws => {
        if (ws.ws.readyState != ws.ws.OPEN || (data?.length <= 0 && query != 'Retrieve')) {
            logger.warn(`Web socket failed sending ${event} event to client.`)
            return;
        }

        ws.send(event, data, query)
        logger.info(`Web socket sent ${event} event to client with ${query} and data[] of length ${data?.length}.`)
    })
    
}

//

module.exports = {
    addWsClient,
    getWsClient,
    delWsClient,
    sendWsClient,
}