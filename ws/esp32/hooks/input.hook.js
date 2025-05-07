const { logger } = require("../../../utils/logger.util")
const { sendWsEsp32, getWsEsp32 } = require("../util.ws")
const { Greenhouse, MCU, Actuator, Action } = require("../../../models/index.model")

/**
 * Sends created input to esp32.
 */
const onAfterInputCreate = async (input, options) => {
	try {
		if (options.source == "esp32") return // Ignore esp32 source

		const actuator = await Actuator.findByPk(input.actuatorId)
		const mcu = await MCU.findByPk(actuator.mcuId)
		const greenhouse = await Greenhouse.findByPk(mcu.greenhouseId)
		const ws = getWsEsp32(greenhouse.key)

		if (!ws) return
		sendWsEsp32(ws, "input", [input], "Create")
	} catch (error) {
		logger.error(error.message, error)
	}
}

/**
 * Sends updated input to esp32.
 */
const onAfterInputUpdate = async (input, options) => {
	try {
		if (options.source == "esp32") return // Ignore esp32 source

		const actuator = await Actuator.findByPk(input.actuatorId)
		const mcu = await MCU.findByPk(actuator.mcuId)
		const greenhouse = await Greenhouse.findByPk(mcu.greenhouseId)
		const ws = getWsEsp32(greenhouse.key)

		if (!ws) return
		sendWsEsp32(ws, "input", [input], "Update")
	} catch (error) {
		logger.error(error.message, error)
	}
}

/**
 * Sends input cascade delete to esp32.
 */
const onBeforeInputDelete = async (input, options) => {
	try {
		if (options.source == "esp32") return // Ignore esp32 source

		const actuator = await Actuator.findByPk(input.actuatorId)
		const mcu = await MCU.findByPk(actuator.mcuId)
		const greenhouse = await Greenhouse.findByPk(mcu.greenhouseId)
		const ws = getWsEsp32(greenhouse.key)
		if (!ws) return

		// delete input
		sendWsEsp32(ws, "input", [input], "Delete")

		// delete input actions
		sendWsEsp32(ws, "action", [{ inputId: input.id }], "Delete")
	} catch (error) {
		logger.error(error.message, error)
	}
}

module.exports = {
	onAfterInputCreate,
	onAfterInputUpdate,
	onBeforeInputDelete,
}
