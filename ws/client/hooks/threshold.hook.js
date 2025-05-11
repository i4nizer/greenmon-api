const { logger } = require("../../../utils/logger.util")
const { sendWsClient, getWsClient } = require("../util.ws")
const { Greenhouse } = require("../../../models/index.model")

//

/**
 * Sends updates to client.
 */
const onAfterThresholdUpdate = async (threshold, options) => {
	try {
		if (options.source == "client") return // Ignore client source

		const greenhouse = await Greenhouse.findByPk(threshold.greenhouseId, { attributes: ["userId"] })
		sendWsClient(greenhouse.userId, "threshold", [threshold], "Update")

	} catch (error) {
		logger.error(error.message, error)
	}
}

//

module.exports = {
	onAfterThresholdUpdate,
}
