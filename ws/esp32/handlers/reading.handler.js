const { Reading } = require("../../../models/index.model")
const { WebSocketClient } = require("../../wsclient.ws")

//

/**
 * Inserts a new record.
 *
 * @param {WebSocketClient} wsClient The web socket instance of esp32.
 * @param {Array} data The readings sent by esp32.
 */
const onCreateReading = async (wsClient, data) => {
	await Reading.bulkCreate(data, { individualHooks: true, source: "esp32" })
}

//

module.exports = {
	onCreateReading,
}
