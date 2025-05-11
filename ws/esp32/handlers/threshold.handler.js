const { Threshold } = require("../../../models/index.model")
const { WebSocketClient } = require("../../wsclient.ws")

//

/**
 * Updates records.
 *
 * @param {WebSocketClient} wsClient The web socket instance of esp32.
 * @param {Array} data The data sent by esp32.
 */
const onUpdateThreshold = async (wsClient, data) => {
	for (const d of data) {
		d.updatedAt = null
		await Threshold.update(d, { where: { id: d.id }, individualHooks: true, source: "esp32" })
	}
}

//

module.exports = {
	onUpdateThreshold,
}
