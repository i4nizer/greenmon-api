const { logger } = require('../../../utils/logger.util')
const { sendWsEsp32, getWsEsp32 } = require('../util.ws')
const { Greenhouse, Condition, Action } = require('../../../models/index.model')



/**
 * Sends created threshold to esp32.
 */
const onAfterThresholdCreate = async (threshold, options) => {
	try {
		const greenhouse = await Greenhouse.findByPk(threshold.greenhouseId)
		const ws = getWsEsp32(greenhouse.key)
		
		if (!ws) return;
		sendWsEsp32(ws, 'threshold', threshold, 'Create')

	} catch (error) {
		logger.error(error.message, error)
	}
}

/**
 * Sends updated threshold to esp32.
 */
const onAfterThresholdUpdate = async (threshold, options) => {
	try {
		const greenhouse = await Greenhouse.findByPk(threshold.greenhouseId)
		const ws = getWsEsp32(greenhouse.key)
		
		if (!ws) return;
		sendWsEsp32(ws, 'threshold', threshold, 'Update')

	} catch (error) {
		logger.error(error.message, error)
	}
}

/**
 * Sends threshold cascade delete to esp32.
 */
const onBeforeThresholdDelete = async (threshold, options) => {
	try {
		const greenhouse = await Greenhouse.findByPk(threshold.greenhouseId)
		const ws = getWsEsp32(greenhouse.key)
		if (!ws) return;

		// delete threshold
		sendWsEsp32(ws, 'threshold', threshold, 'Delete')
		
        // delete threshold conditions
        sendWsEsp32(ws, "condition", [{ thresholdId: threshold.id }], "Delete")

        // delete threshold actions
        sendWsEsp32(ws, 'action', [{ thresholdId: threshold.id }], 'Delete')

	} catch (error) {
		logger.error(error.message, error)
	}
}



module.exports = {
	onAfterThresholdCreate,
	onAfterThresholdUpdate,
	onBeforeThresholdDelete,
}