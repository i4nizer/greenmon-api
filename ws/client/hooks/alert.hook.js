const { logger } = require("../../../utils/logger.util")
const { sendWsClient } = require("../util.ws")

//

/**
 * Sends created alert to client.
 */
const onAfterAlertCreate = async (alert, options) => {
	try {
		if (options.source == "client") return // Ignore client source
		
		sendWsClient(alert.userId, "alert", [alert], "Create")

	} catch (error) {
		logger.error(error.message, error)
	}
}

//

module.exports = {
	onAfterAlertCreate,
}
