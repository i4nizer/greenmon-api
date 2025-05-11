const { logger } = require("../../../utils/logger.util")
const { sendWsEsp32 } = require("../util.ws")
const { Greenhouse, MCU, Actuator, Input, Action } = require("../../../models/index.model")

//

/**
 * Sends created actuator to esp32.
 */
const onAfterActuatorCreate = async (actuator, options) => {
	try {
		if (options.source == "esp32") return // Ignore esp32 source

		const mcu = await MCU.findByPk(actuator.mcuId)
		const greenhouse = await Greenhouse.findByPk(mcu.greenhouseId)
		sendWsEsp32(greenhouse.key, "actuator", [actuator], "Create")

	} catch (error) {
		logger.error(error.message, error)
	}
}

/**
 * Sends updated actuator to esp32.
 */
const onAfterActuatorUpdate = async (actuator, options) => {
	try {
		if (options.source == "esp32") return // Ignore esp32 source

		const mcu = await MCU.findByPk(actuator.mcuId)
		const greenhouse = await Greenhouse.findByPk(mcu.greenhouseId)
		sendWsEsp32(greenhouse.key, "actuator", [actuator], "Update")

	} catch (error) {
		logger.error(error.message, error)
	}
}

/**
 * Sends actuator cascade delete to esp32.
 */
const onBeforeActuatorDelete = async (actuator, options) => {
	try {
		if (options.source == "esp32") return // Ignore esp32 source

		const mcu = await MCU.findByPk(actuator.mcuId)
		const greenhouse = await Greenhouse.findByPk(mcu.greenhouseId)
		
		// delete actuator
		sendWsEsp32(greenhouse.key, "actuator", [actuator], "Delete")

		// delete actuators inputs
		const inputs = await Input.findAll({ where: { actuatorId: actuator.id } })
		sendWsEsp32(greenhouse.key, "input", [{ actuatorId: actuator.id }], "Delete")

		// delete actuator inputs actions
		sendWsEsp32(greenhouse.key, "action", inputs.map((i) => ({ inputId: i.id })), "Delete")

	} catch (error) {
		logger.error(error.message, error)
	}
}

//

module.exports = {
	onAfterActuatorCreate,
	onAfterActuatorUpdate,
	onBeforeActuatorDelete,
}
