const { logger } = require("../../../utils/logger.util")
const { sendWsClient } = require("../util.ws")
const { Greenhouse } = require("../../../models/index.model")

//

/**
 * Sends updated action to client.
 */
const onAfterActionUpdate = async (action, options) => {
	try {
		if (options.source == "client") return // Ignore client source

		const greenhouse = await Greenhouse.findByPk(action.greenhouseId, { attributes: ["userId"] })
		sendWsClient(greenhouse.userId, "action", [action], "Update")

	} catch (error) {
		logger.error(error.message, error)
	}
}

//

module.exports = {
	onAfterActionUpdate,
}
