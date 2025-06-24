const { logger } = require("../../../utils/logger.util")
const { Action } = require("../../../models/index.model")
const { WebSocketClient } = require("../../wsclient.ws")
const { updateActionSchema } = require('../validations/action.validation')

//

/**
 * Updates records.
 *
 * @param {WebSocketClient} wsClient The web socket instance of esp32.
 * @param {Array} data The actions sent by esp32.
 */
const onUpdateAction = async (wsClient, data) => {
	for (const d of data) {
		const { value, error } = updateActionSchema.validate(d, { stripUnknown: true })
		
		if (error) logger.error(`Web socket action update validation error ${error.message}`, error)
		else await Action.update(value, { where: { id: value.id }, individualHooks: true, source: "esp32" })
	}
}

//

module.exports = {
	onUpdateAction,
}
