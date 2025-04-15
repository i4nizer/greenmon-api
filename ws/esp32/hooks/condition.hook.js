const { logger } = require('../../../utils/logger.util')
const { sendWsEsp32, getWsEsp32 } = require('../util.ws')
const { Greenhouse, Threshold } = require('../../../models/index.model')



/**
 * Sends created condition to esp32.
 */
const onAfterConditionCreate = async (condition, options) => {
    try {
        const threshold = await Threshold.findByPk(condition.thresholdId)
		const greenhouse = await Greenhouse.findByPk(threshold.greenhouseId)
		const ws = getWsEsp32(greenhouse.key)
		
		if (!ws) return;
		sendWsEsp32(ws, 'condition', condition, 'Create')

	} catch (error) {
		logger.error(error.message, error)
	}
}

/**
 * Sends updated condition to esp32.
 */
const onAfterConditionUpdate = async (condition, options) => {
	try {
		const threshold = await Threshold.findByPk(condition.thresholdId)
		const greenhouse = await Greenhouse.findByPk(threshold.greenhouseId)
		const ws = getWsEsp32(greenhouse.key)
		
		if (!ws) return;
		sendWsEsp32(ws, 'condition', condition, 'Update')

	} catch (error) {
		logger.error(error.message, error)
	}
}

/**
 * Sends condition cascade delete to esp32.
 */
const onBeforeConditionDelete = async (condition, options) => {
	try {
		const threshold = await Threshold.findByPk(condition.thresholdId)
		const greenhouse = await Greenhouse.findByPk(threshold.greenhouseId)
		const ws = getWsEsp32(greenhouse.key)
		if (!ws) return;

		// delete condition
		sendWsEsp32(ws, 'condition', condition, 'Delete')

	} catch (error) {
		logger.error(error.message, error)
	}
}



module.exports = {
	onAfterConditionCreate,
	onAfterConditionUpdate,
	onBeforeConditionDelete,
}