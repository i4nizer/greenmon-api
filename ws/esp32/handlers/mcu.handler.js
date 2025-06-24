const { logger } = require("../../../utils/logger.util")
const { MCU } = require("../../../models/index.model")
const { WebSocketClient } = require("../../wsclient.ws")
const { updateMcuSchema } = require('../validations/mcu.validation')

//

/**
 * Updates records.
 *
 * @param {WebSocketClient} wsClient The web socket instance of esp32.
 * @param {Array} data The mcu update sent by esp32.
 */
const onUpdateMcu = async (wsClient, data) => {
	for (const d of data) {
		const { value, error } = updateMcuSchema.validate(d, { stripUnknown: true })

		if (error) logger.error(`Web socket mcu update validation error ${error.message}.`, error)
		else await MCU.update(value, { where: { id: value.id }, individualHooks: true, source: "esp32" })
	}
}

//

module.exports = {
	onUpdateMcu,
}
