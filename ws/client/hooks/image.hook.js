const { logger } = require("../../../utils/logger.util")
const { sendWsClient } = require("../util.ws")
const { Greenhouse } = require("../../../models/index.model")

//

/**
 * Sends created image to client.
 */
const onAfterImageCreate = async (image, options) => {
	try {
		if (options.source == "client") return // Ignore client source

		const greenhouse = await Greenhouse.findByPk(image.greenhouseId, { attributes: ["userId"] })
		sendWsClient(greenhouse.userId, "image", [image], "Create")

	} catch (error) {
		logger.error(error.message, error)
	}
}

//

module.exports = {
	onAfterImageCreate,
}
