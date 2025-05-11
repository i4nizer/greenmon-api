const { logger } = require("../../../utils/logger.util")
const { sendWsEsp32, getWsEsp32 } = require("../util.ws")
const { Greenhouse, Action } = require("../../../models/index.model")

//

/**
 * Sends created schedule to esp32.
 */
const onAfterScheduleCreate = async (schedule, options) => {
	try {
		if (options.source == "esp32") return // Ignore esp32 source

		const greenhouse = await Greenhouse.findByPk(schedule.greenhouseId)
		sendWsEsp32(greenhouse.key, "schedule", [schedule], "Create")

	} catch (error) {
		logger.error(error.message, error)
	}
}

/**
 * Sends updated schedule to esp32.
 */
const onAfterScheduleUpdate = async (schedule, options) => {
	try {
		if (options.source == "esp32") return // Ignore esp32 source

		const greenhouse = await Greenhouse.findByPk(schedule.greenhouseId)
		sendWsEsp32(greenhouse.key, "schedule", [schedule], "Update")

	} catch (error) {
		logger.error(error.message, error)
	}
}

/**
 * Sends schedule cascade delete to esp32.
 */
const onBeforeScheduleDelete = async (schedule, options) => {
	try {
		if (options.source == "esp32") return // Ignore esp32 source

		const greenhouse = await Greenhouse.findByPk(schedule.greenhouseId)

		// delete schedule
		sendWsEsp32(greenhouse.key, "schedule", [schedule], "Delete")

		// delete schedule actions
		sendWsEsp32(greenhouse.key, "action", [{ scheduleId: schedule.id }], "Delete")
		
	} catch (error) {
		logger.error(error.message, error)
	}
}

//

module.exports = {
	onAfterScheduleCreate,
	onAfterScheduleUpdate,
	onBeforeScheduleDelete,
}
