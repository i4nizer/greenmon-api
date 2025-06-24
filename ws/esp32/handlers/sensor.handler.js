const { Sensor } = require("../../../models/index.model")
const { logger } = require("../../../utils/logger.util")
const { WebSocketClient } = require("../../wsclient.ws")
const { updateSensorSchema } = require('../validations/sensor.validation')

//

/**
 * Updates records.
 *
 * @param {WebSocketClient} wsClient The web socket instance of esp32.
 * @param {Array} data The sensors sent by esp32.
 */
const onUpdateSensor = async (wsClient, data) => {
	for (const d of data) {
		const { value, error } = updateSensorSchema.validate(d, { stripUnknown: true })

		if (error) logger.error(`Web socket sensor update validation error ${error.message}.`, error)
		else await Sensor.update(value, { where: { id: value.id }, individualHooks: true, source: "esp32" })
	}
}

//

module.exports = {
	onUpdateSensor,
}
