const { logger } = require("../../../utils/logger.util")
const { sendWsEsp32 } = require("../util.ws")
const { Greenhouse, MCU, Actuator, Action } = require("../../../models/index.model")

//

/**
 * Sends created input to esp32.
 */
const onAfterInputCreate = async (input, options) => {
	try {
		if (options.source == "esp32") return // Ignore esp32 source

		const actuator = await Actuator.findByPk(input.actuatorId)
		const mcu = await MCU.findByPk(actuator.mcuId)
		const greenhouse = await Greenhouse.findByPk(mcu.greenhouseId)
		sendWsEsp32(greenhouse.key, "input", [input], "Create")

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
		sendWsEsp32(greenhouse.key, "input", [input], "Update")

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

		// delete input
		sendWsEsp32(greenhouse.key, "input", [input], "Delete")

		// delete input actions
		sendWsEsp32(greenhouse.key, "action", [{ inputId: input.id }], "Delete")

	} catch (error) {
		logger.error(error.message, error)
	}
}

//

module.exports = {
	onAfterInputCreate,
	onAfterInputUpdate,
	onBeforeInputDelete,
}
