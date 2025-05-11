const { logger } = require("../../../utils/logger.util")
const { sendWsClient } = require("../util.ws")
const { Greenhouse, MCU, Sensor, Output } = require("../../../models/index.model")

//

/**
 * Sends created reading to client.
 */
const onAfterReadingCreate = async (reading, options) => {
	try {
		if (options.source == "client") return // Ignore client source

		const output = await Output.findByPk(reading.outputId, { attributes: ["sensorId"] })
		const sensor = await Sensor.findByPk(output.sensorId, { attributes: ["mcuId"] })
		const mcu = await MCU.findByPk(sensor.mcuId, { attributes: ["greenhouseId"] })
		const greenhouse = await Greenhouse.findByPk(mcu.greenhouseId, { attributes: ["userId"] })
		sendWsClient(greenhouse.userId, "reading", [reading], "Create")

	} catch (error) {
		logger.error(error.message, error)
	}
}

//

module.exports = {
	onAfterReadingCreate,
}
