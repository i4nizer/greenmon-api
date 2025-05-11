const { logger } = require("../../../utils/logger.util")
const { sendWsClient, getWsClient } = require("../util.ws")
const { Greenhouse, Threshold } = require("../../../models/index.model")

//

/**
 * Sends updates to client.
 */
const onAfterConditionUpdate = async (condition, options) => {
	try {
		if (options.source == "client") return // Ignore client source

		const threshold = await Threshold.findByPk(condition.thresholdId, { attributes: ["greenhouseId"] })
		const greenhouse = await Greenhouse.findByPk(threshold.greenhouseId, { attributes: ["userId"] })
		sendWsClient(greenhouse.userId, "condition", [condition], "Update")

	} catch (error) {
		logger.error(error.message, error)
	}
}

//

module.exports = {
	onAfterConditionUpdate,
}
