const { logger } = require("../../../utils/logger.util")
const { sendWsClient } = require("../util.ws")
const { Greenhouse } = require("../../../models/index.model")

//

/**
 * Sends created log to client.
 */
const onAfterLogCreate = async (log, options) => {
	try {
		if (options.source == "client") return // Ignore client source

		const greenhouse = await Greenhouse.findByPk(log.greenhouseId, { attributes: ["userId"] })
		sendWsClient(greenhouse.userId, "log", [log], "Create")

	} catch (error) {
		logger.error(error.message, error)
	}
}

//

module.exports = {
	onAfterLogCreate,
}
