const { logger } = require("../../../utils/logger.util")
const { sendWsEsp32 } = require("../util.ws")
const { Greenhouse, MCU, Sensor, Condition } = require("../../../models/index.model")

//

/**
 * Sends created output to esp32.
 */
const onAfterOutputCreate = async (output, options) => {
	try {
		if (options.source == "esp32") return // Ignore esp32 source

		const sensor = await Sensor.findByPk(output.sensorId)
		const mcu = await MCU.findByPk(sensor.mcuId)
		const greenhouse = await Greenhouse.findByPk(mcu.greenhouseId)
		sendWsEsp32(greenhouse.key, "output", [output], "Create")

	} catch (error) {
		logger.error(error.message, error)
	}
}

/**
 * Sends updated output to esp32.
 */
const onAfterOutputUpdate = async (output, options) => {
	try {
		if (options.source == "esp32") return // Ignore esp32 source

		const sensor = await Sensor.findByPk(output.sensorId)
		const mcu = await MCU.findByPk(sensor.mcuId)
		const greenhouse = await Greenhouse.findByPk(mcu.greenhouseId)
		sendWsEsp32(greenhouse.key, "output", [output], "Update")

	} catch (error) {
		logger.error(error.message, error)
	}
}

/**
 * Sends output cascade delete to esp32.
 */
const onBeforeOutputDelete = async (output, options) => {
	try {
		if (options.source == "esp32") return // Ignore esp32 source

		const sensor = await Sensor.findByPk(output.sensorId)
		const mcu = await MCU.findByPk(sensor.mcuId)
		const greenhouse = await Greenhouse.findByPk(mcu.greenhouseId)
		
		// delete output
		sendWsEsp32(greenhouse.key, "output", [output], "Delete")

		// delete output conditions
		sendWsEsp32(greenhouse.key, "condition", [{ outputId: output.id }], "Delete")

	} catch (error) {
		logger.error(error.message, error)
	}
}

//

module.exports = {
	onAfterOutputCreate,
	onAfterOutputUpdate,
	onBeforeOutputDelete,
}
