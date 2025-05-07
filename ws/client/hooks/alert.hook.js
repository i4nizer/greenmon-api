const { logger } = require("../../../utils/logger.util")
const { sendWsClient, getWsClient } = require("../util.ws")

/**
 * Sends created alert to client.
 */
const onAfterAlertCreate = async (alert, options) => {
	try {
		if (options.source == "client") return // Ignore client source

		const ws = getWsClient(alert.userId)
		if (!ws) return
		sendWsClient(ws, "alert", [alert], "Create")
	} catch (error) {
		logger.error(error.message, error)
	}
}

module.exports = {
	onAfterAlertCreate,
}
