const { logger } = require("../../../utils/logger.util")
const { Input } = require("../../../models/index.model")
const { WebSocketClient } = require("../../wsclient.ws")
const { updateInputSchema } = require('../validations/input.validation')

//

/**
 * Updates records.
 *
 * @param {WebSocketClient} wsClient The web socket instance of esp32.
 * @param {Array} data The inputs sent by esp32.
 */
const onUpdateInput = async (wsClient, data) => {
	for (const d of data) {
		const { value, error } = updateInputSchema.validate(d, { stripUnknown: true })

		if (error) logger.error(`Web socket input update validation error ${error.message}.`, error)
		else await Input.update(value, { where: { id: value.id }, individualHooks: true, source: "esp32" })
	}
}

//

module.exports = {
	onUpdateInput,
}
