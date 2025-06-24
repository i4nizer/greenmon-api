const { logger } = require("../../../utils/logger.util")
const { Reading } = require("../../../models/index.model")
const { WebSocketClient } = require("../../wsclient.ws")
const { createReadingSchema } = require('../validations/reading.validation')

//

/**
 * Inserts a new record.
 *
 * @param {WebSocketClient} wsClient The web socket instance of esp32.
 * @param {Array} data The readings sent by esp32.
 */
const onCreateReading = async (wsClient, data) => {
	const validReadings = []
	
	for (const d of data) {
		d.greenhouseId = wsClient.payload?.greenhouseId
		const { value, error } = createReadingSchema.validate(d, { stripUnknown: true })
		
		if (error) logger.error(`Web socket reading create validation error ${error.message}.`, error)
		else validReadings.push(value)
	}

	if (validReadings.length > 0) await Reading.bulkCreate(validReadings, { individualHooks: true, source: "esp32" })
}

//

module.exports = {
	onCreateReading,
}
