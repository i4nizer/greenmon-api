const { logger } = require('../../../utils/logger.util')
const { sendWsEsp32 } = require('../util.ws')
const { Greenhouse, Threshold } = require('../../../models/index.model')

//

/**
 * Sends created action to esp32.
 */
const onAfterActionCreate = async (action, options) => {
	try {
		if (options.source === 'esp32') return; // Ignore esp32 source

        const threshold = await Threshold.findByPk(action.thresholdId)
		const greenhouse = await Greenhouse.findByPk(threshold.greenhouseId)
		sendWsEsp32(greenhouse.key, 'action', [action], 'Create')

	} catch (error) {
		logger.error(error.message, error)
	}
}

/**
 * Sends updated action to esp32.
 */
const onAfterActionUpdate = async (action, options) => {
	try {
		if (options.source === 'esp32') return; // Ignore esp32 source

		const threshold = await Threshold.findByPk(action.thresholdId)
		const greenhouse = await Greenhouse.findByPk(threshold.greenhouseId)
		sendWsEsp32(greenhouse.key, "action", [action], "Update")

	} catch (error) {
		logger.error(error.message, error)
	}
}

/**
 * Sends action cascade delete to esp32.
 */
const onBeforeActionDelete = async (action, options) => {
	try {
		if (options.source === 'esp32') return; // Ignore esp32 source
		
		const threshold = await Threshold.findByPk(action.thresholdId)
		const greenhouse = await Greenhouse.findByPk(threshold.greenhouseId)
		sendWsEsp32(greenhouse.key, "action", [action], "Delete")

	} catch (error) {
		logger.error(error.message, error)
	}
}

//

module.exports = {
	onAfterActionCreate,
	onAfterActionUpdate,
	onBeforeActionDelete,
}