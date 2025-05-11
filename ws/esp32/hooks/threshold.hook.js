const { logger } = require("../../../utils/logger.util")
const { sendWsEsp32 } = require("../util.ws")
const { Greenhouse, Condition, Action } = require("../../../models/index.model")

//

/**
 * Sends created threshold to esp32.
 */
const onAfterThresholdCreate = async (threshold, options) => {
	try {
		if (options.source == "esp32") return // Ignore esp32 source

		const greenhouse = await Greenhouse.findByPk(threshold.greenhouseId)
		sendWsEsp32(greenhouse.key, "threshold", [threshold], "Create")

	} catch (error) {
		logger.error(error.message, error)
	}
}

/**
 * Sends updated threshold to esp32.
 */
const onAfterThresholdUpdate = async (threshold, options) => {
	try {
		if (options.source == "esp32") return // Ignore esp32 source

		const greenhouse = await Greenhouse.findByPk(threshold.greenhouseId)
		sendWsEsp32(greenhouse.key, "threshold", [threshold], "Update")

	} catch (error) {
		logger.error(error.message, error)
	}
}

/**
 * Sends threshold cascade delete to esp32.
 */
const onBeforeThresholdDelete = async (threshold, options) => {
	try {
		if (options.source === "esp32") return // Ignore esp32 source

		const greenhouse = await Greenhouse.findByPk(threshold.greenhouseId)

		// delete threshold
		sendWsEsp32(greenhouse.key, "threshold", [threshold], "Delete")

		// delete threshold conditions
		sendWsEsp32(greenhouse.key, "condition", [{ thresholdId: threshold.id }], "Delete")

		// delete threshold actions
		sendWsEsp32(greenhouse.key, "action", [{ thresholdId: threshold.id }], "Delete")

	} catch (error) {
		logger.error(error.message, error)
	}
}

//

module.exports = {
	onAfterThresholdCreate,
	onAfterThresholdUpdate,
	onBeforeThresholdDelete,
}
