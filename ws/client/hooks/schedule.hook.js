const { logger } = require("../../../utils/logger.util")
const { sendWsClient } = require("../util.ws")
const { Greenhouse } = require("../../../models/index.model")

//

/**
 * Sends updates to client.
 */
const onAfterScheduleUpdate = async (schedule, options) => {
	try {
		if (options.source == "client") return // Ignore client source

		const greenhouse = await Greenhouse.findByPk(schedule.greenhouseId, { attributes: ["userId"] })
		sendWsClient(greenhouse.userId, "schedule", [schedule], "Update")

	} catch (error) {
		logger.error(error.message, error)
	}
}

//

module.exports = {
	onAfterScheduleUpdate,
}
