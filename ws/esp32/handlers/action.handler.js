const { Action } = require("../../../models/index.model")
const { WebSocketClient } = require("../../wsclient.ws")

//

/**
 * Updates records.
 *
 * @param {WebSocketClient} wsClient The web socket instance of esp32.
 * @param {Array} data The actions sent by esp32.
 */
const onUpdateAction = async (wsClient, data) => {
	for (const d of data) {
		d.updatedAt = null
		await Action.update(d, { where: { id: d.id }, individualHooks: true, source: "esp32" })
	}
}

//

module.exports = {
	onUpdateAction,
}
