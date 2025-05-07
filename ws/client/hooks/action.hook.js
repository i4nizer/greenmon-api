const { logger } = require("../../../utils/logger.util")
const { sendWsClient, getWsClient } = require("../util.ws")
const { Greenhouse } = require("../../../models/index.model")

/**
 * Sends updated action to client.
 */
const onAfterActionUpdate = async (action, options) => {
	try {
		if (options.source == "client") return // Ignore client source

		const greenhouse = await Greenhouse.findByPk(action.greenhouseId, { attributes: ["userId"] })
		const ws = getWsClient(greenhouse.userId)

		if (!ws) return
		sendWsClient(ws, "action", [action], "Update")
	} catch (error) {
		logger.error(error.message, error)
	}
}

module.exports = {
	onAfterActionUpdate,
}
