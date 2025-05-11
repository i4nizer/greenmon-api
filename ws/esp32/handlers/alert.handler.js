const { Alert } = require("../../../models/index.model")
const { WebSocketClient } = require("../../wsclient.ws")

//

/**
 * Inserts a new record.
 *
 * @param {WebSocketClient} wsClient The web socket instance of esp32.
 * @param {Array} data The alerts sent by esp32.
 */
const onCreateAlert = async (wsClient, data) => {
	await Alert.bulkCreate(data, { individualHooks: true, source: "esp32" })
}

//

module.exports = {
	onCreateAlert,
}
