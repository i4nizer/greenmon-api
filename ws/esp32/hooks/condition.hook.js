const { logger } = require("../../../utils/logger.util")
const { sendWsEsp32 } = require("../util.ws")
const { Greenhouse, Threshold } = require("../../../models/index.model")

//

/**
 * Sends created condition to esp32.
 */
const onAfterConditionCreate = async (condition, options) => {
	try {
		if (options.source == "esp32") return // Ignore esp32 source

		const threshold = await Threshold.findByPk(condition.thresholdId)
		const greenhouse = await Greenhouse.findByPk(threshold.greenhouseId)
		sendWsEsp32(greenhouse.key, "condition", [condition], "Create")

	} catch (error) {
		logger.error(error.message, error)
	}
}

/**
 * Sends updated condition to esp32.
 */
const onAfterConditionUpdate = async (condition, options) => {
	try {
		if (options.source == "esp32") return // Ignore esp32 source

		const threshold = await Threshold.findByPk(condition.thresholdId)
		const greenhouse = await Greenhouse.findByPk(threshold.greenhouseId)
		sendWsEsp32(greenhouse.key, "condition", [condition], "Update")
		
	} catch (error) {
		logger.error(error.message, error)
	}
}

/**
 * Sends condition cascade delete to esp32.
 */
const onBeforeConditionDelete = async (condition, options) => {
	try {
		if (options.source == "esp32") return // Ignore esp32 source

		const threshold = await Threshold.findByPk(condition.thresholdId)
		const greenhouse = await Greenhouse.findByPk(threshold.greenhouseId)

		// delete condition
		sendWsEsp32(greenhouse.key, "condition", [condition], "Delete")

	} catch (error) {
		logger.error(error.message, error)
	}
}

//

module.exports = {
	onAfterConditionCreate,
	onAfterConditionUpdate,
	onBeforeConditionDelete,
}
