const { logger } = require("../../../utils/logger.util")
const { sendWsClient, getWsClient } = require("../util.ws")
const { Output, Sensor, MCU, Greenhouse } = require("../../../models/index.model")

/**
 * Sends created image to client.
 */
const onAfterImageCreate = async (image, options) => {
	try {
		if (options.source == "client") return // Ignore client source

		const output = await Output.findByPk(image.outputId, { attributes: ["sensorId"] })
		const sensor = await Sensor.findByPk(output.sensorId, { attributes: ["mcuId"] })
		const mcu = await MCU.findByPk(sensor.mcuId, { attributes: ["greenhouseId"] })
		const greenhouse = await Greenhouse.findByPk(mcu.greenhouseId, { attributes: ["userId"] })

		const ws = getWsClient(greenhouse.userId)
		if (!ws) return
		sendWsClient(ws, "image", [image], "Create")
	} catch (error) {
		logger.error(error.message, error)
	}
}

module.exports = {
	onAfterImageCreate,
}
