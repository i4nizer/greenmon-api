const { logger } = require('../../../utils/logger.util')
const { sendWsEsp32, getWsEsp32 } = require('../util.ws')
const { Greenhouse, Threshold } = require('../../../models/index.model')



/**
 * Sends created action to esp32.
 */
const onAfterActionCreate = async (action, options) => {
    try {
        const threshold = await Threshold.findByPk(action.thresholdId)
		const greenhouse = await Greenhouse.findByPk(threshold.greenhouseId)
		const ws = getWsEsp32(greenhouse.key)
		
		if (!ws) return;
		sendWsEsp32(ws, 'action', action, 'Create')

	} catch (error) {
		logger.error(error.message, error)
	}
}

/**
 * Sends updated action to esp32.
 */
const onAfterActionUpdate = async (action, options) => {
	try {
		const threshold = await Threshold.findByPk(action.thresholdId)
		const greenhouse = await Greenhouse.findByPk(threshold.greenhouseId)
		const ws = getWsEsp32(greenhouse.key)
		
		if (!ws) return;
		sendWsEsp32(ws, 'action', action, 'Update')

	} catch (error) {
		logger.error(error.message, error)
	}
}

/**
 * Sends action cascade delete to esp32.
 */
const onBeforeActionDelete = async (action, options) => {
	try {
		const threshold = await Threshold.findByPk(action.thresholdId)
		const greenhouse = await Greenhouse.findByPk(threshold.greenhouseId)
		const ws = getWsEsp32(greenhouse.key)
		if (!ws) return;

		// delete action
		sendWsEsp32(ws, 'action', action, 'Delete')

	} catch (error) {
		logger.error(error.message, error)
	}
}



module.exports = {
	onAfterActionCreate,
	onAfterActionUpdate,
	onBeforeActionDelete,
}