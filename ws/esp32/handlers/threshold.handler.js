const { logger } = require("../../../utils/logger.util")
const { Threshold } = require("../../../models/index.model")
const { WebSocketClient } = require("../../wsclient.ws")
const { updateThresholdSchema } = require('../validations/threshold.validation')

//

/**
 * Updates records.
 *
 * @param {WebSocketClient} wsClient The web socket instance of esp32.
 * @param {Array} data The data sent by esp32.
 */
const onUpdateThreshold = async (wsClient, data) => {
	for (const d of data) {
		const { value, error } = updateThresholdSchema.validate(d, { stripUnknown: true })

		if (error) logger.error(`Web socket threshold update validation error ${error.message}.`, error)
		else await Threshold.update(value, { where: { id: value.id }, individualHooks: true, source: "esp32" })
	}
}

//

module.exports = {
	onUpdateThreshold,
}
