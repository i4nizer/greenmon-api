const { logger } = require("../../../utils/logger.util")
const { sendWsClient } = require("../util.ws")
const { Greenhouse, MCU } = require("../../../models/index.model")

//

/**
 * Sends updated sensor to client.
 */
const onAfterSensorUpdate = async (sensor, options) => {
	try {
		if (options.source == "client") return // Ignore client source

		const mcu = await MCU.findByPk(sensor.mcuId, { attributes: ["greenhouseId"] })
		const greenhouse = await Greenhouse.findByPk(mcu.greenhouseId, { attributes: ["userId"] })
		sendWsClient(greenhouse.userId, "sensor", [sensor], "Update")

	} catch (error) {
		logger.error(error.message, error)
	}
}

//

module.exports = {
	onAfterSensorUpdate,
}
