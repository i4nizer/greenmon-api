const { logger } = require("../../../utils/logger.util")
const { sendWsClient, getWsClient } = require("../util.ws")
const { Greenhouse, Actuator, MCU } = require("../../../models/index.model")

/**
 * Sends updated input to client.
 */
const onAfterInputUpdate = async (input, options) => {
	try {
		if (options.source == "client") return // Ignore client source

		const actuator = await Actuator.findByPk(input.actuatorId, { attributes: ["mcuId"] })
		const mcu = await MCU.findByPk(actuator.mcuId, { attributes: ["greenhouseId"] })
		const greenhouse = await Greenhouse.findByPk(mcu.greenhouseId, { attributes: ["userId"] })
		const ws = getWsClient(greenhouse.userId)

		if (!ws) return
		sendWsClient(ws, "input", [input], "Update")
	} catch (error) {
		logger.error(error.message, error)
	}
}

module.exports = {
	onAfterInputUpdate,
}
