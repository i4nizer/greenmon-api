const { logger } = require("../../../utils/logger.util")
const { Condition } = require("../../../models/index.model")
const { WebSocketClient } = require("../../wsclient.ws")
const { updateConditionSchema } = require('../validations/condition.validation')

//

/**
 * Updates records.
 *
 * @param {WebSocketClient} wsClient The web socket instance of esp32.
 * @param {Array} data The data sent by esp32.
 */
const onUpdateCondition = async (wsClient, data) => {
	for (const d of data) {
		const { value, error } = updateConditionSchema.validate(d, { stripUnknown: true })

		if (error) logger.error(`Web socket condition update validation error ${error.message}.`, error)
		else await Condition.update(value, { where: { id: value.id }, individualHooks: true, source: "esp32" })
	}
}

//

module.exports = {
	onUpdateCondition,
}
