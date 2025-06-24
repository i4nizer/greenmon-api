const { logger } = require("../../../utils/logger.util")
const { Schedule } = require("../../../models/index.model")
const { WebSocketClient } = require("../../wsclient.ws")
const { updateScheduleSchema } = require('../validations/schedule.validation')

//

/**
 * Updates records.
 *
 * @param {WebSocketClient} wsClient The web socket instance of esp32.
 * @param {Array} data The data sent by esp32.
 */
const onUpdateSchedule = async (wsClient, data) => {
	for (const d of data) {
		const { value, error } = updateScheduleSchema.validate(d, { stripUnknown: true })

		if (error) logger.error(`Web socket schedule update validation error ${error.message}.`, error)
		else await Schedule.update(value, { where: { id: value.id }, individualHooks: true, source: "esp32" })
	}
}

//

module.exports = {
	onUpdateSchedule,
}
