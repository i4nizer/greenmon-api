const { logger } = require('../../../utils/logger.util')
const { sendWsEsp32, getWsEsp32 } = require('../util.ws')
const { Greenhouse, Action } = require('../../../models/index.model')



/**
 * Sends created schedule to esp32.
 */
const onAfterScheduleCreate = async (schedule, options) => {
	try {
		const greenhouse = await Greenhouse.findByPk(schedule.greenhouseId)
		const ws = getWsEsp32(greenhouse.key)
		
		if (!ws) return;
		sendWsEsp32(ws, 'schedule', schedule, 'Create')

	} catch (error) {
		logger.error(error.message, error)
	}
}

/**
 * Sends updated schedule to esp32.
 */
const onAfterScheduleUpdate = async (schedule, options) => {
	try {
		const greenhouse = await Greenhouse.findByPk(schedule.greenhouseId)
		const ws = getWsEsp32(greenhouse.key)
		
		if (!ws) return;
		sendWsEsp32(ws, 'schedule', schedule, 'Update')

	} catch (error) {
		logger.error(error.message, error)
	}
}

/**
 * Sends schedule cascade delete to esp32.
 */
const onBeforeScheduleDelete = async (schedule, options) => {
	try {
		const greenhouse = await Greenhouse.findByPk(schedule.greenhouseId)
		const ws = getWsEsp32(greenhouse.key)
		if (!ws) return;

		// delete schedule
		sendWsEsp32(ws, 'schedule', schedule, 'Delete')
		
        // delete schedule actions
        sendWsEsp32(ws, 'action', [{ scheduleId: schedule.id }], 'Delete')

	} catch (error) {
		logger.error(error.message, error)
	}
}



module.exports = {
	onAfterScheduleCreate,
	onAfterScheduleUpdate,
	onBeforeScheduleDelete,
}