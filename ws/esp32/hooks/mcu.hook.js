const { logger } = require("../../../utils/logger.util")
const { sendWsEsp32 } = require("../util.ws")
const { Greenhouse, Pin, Sensor, Output, Actuator, Input, Condition, Action } = require("../../../models/index.model")

//

/**
 * Sends created mcu to esp32.
 */
const onAfterMcuCreate = async (mcu, options) => {
	try {
		if (options.source == "esp32") return // Ignore esp32 source

		const greenhouse = await Greenhouse.findByPk(mcu.greenhouseId)
		sendWsEsp32(greenhouse.key, "mcu", [mcu], "Create")

	} catch (error) {
		logger.error(error.message, error)
	}
}

/**
 * Sends updated mcu to esp32.
 */
const onAfterMcuUpdate = async (mcu, options) => {
	try {
		if (options.source == "esp32") return // Ignore esp32 source

		const greenhouse = await Greenhouse.findByPk(mcu.greenhouseId)
		sendWsEsp32(greenhouse.key, "mcu", [mcu], "Update")

	} catch (error) {
		logger.error(error.message, error)
	}
}

/**
 * Sends mcu cascade delete to esp32.
 */
const onBeforeMcuDelete = async (mcu, options) => {
	try {
		if (options.source == "esp32") return // Ignore esp32 source

		const greenhouse = await Greenhouse.findByPk(mcu.greenhouseId)
		
		// delete mcu
		sendWsEsp32(greenhouse.key, "mcu", [mcu], "Delete")

		// delete mcu pins
		sendWsEsp32(greenhouse.key, "pin", [{ mcuId: mcu.id }], "Delete")

		// delete mcu sensors
		const sensors = await Sensor.findAll({ where: { mcuId: mcu.id } })
		sendWsEsp32(greenhouse.key, "sensor", [{ mcuId: mcu.id }], "Delete")

		// delete mcu sensors outputs
		const outputs = await Output.findAll({ where: { sensorId: sensors.map((s) => s.id) } })
		sendWsEsp32(
			greenhouse.key,
			"output",
			sensors.map((s) => ({ sensorId: s.id })),
			"Delete"
		)

		// delete mcu sensors outputs conditions
		sendWsEsp32(
			greenhouse.key,
			"condition",
			outputs.map((o) => ({ outputId: o.id })),
			"Delete"
		)

		// delete mcu actuators
		const actuators = await Actuator.findAll({ where: { mcuId: mcu.id } })
		sendWsEsp32(greenhouse.key, "actuator", [{ mcuId: mcu.id }], "Delete")

		// delete mcu actuators inputs
		const inputs = await Input.findAll({ where: { actuatorId: actuators.map((a) => a.id) } })
		sendWsEsp32(
			greenhouse.key,
			"input",
			actuators.map((a) => ({ actuatorId: a.id })),
			"Delete"
		)

		// delete mcu actuator inputs actions
		sendWsEsp32(
			greenhouse.key,
			"action",
			inputs.map((i) => ({ inputId: i.id })),
			"Delete"
		)
	} catch (error) {
		logger.error(error.message, error)
	}
}

//

module.exports = {
	onAfterMcuCreate,
	onAfterMcuUpdate,
	onBeforeMcuDelete,
}
