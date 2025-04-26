const { logger } = require('../../../utils/logger.util')
const { sendWsClient, getWsClient } = require('../util.ws')
const { Greenhouse, MCU, Sensor, Output } = require('../../../models/index.model')



/**
 * Sends created reading to client.
 */
const onAfterReadingCreate = async (reading, options) => {
    try {
        const output = await Output.findByPk(reading.outputId, { attributes: ['sensorId'] })
        const sensor = await Sensor.findByPk(output.sensorId, { attributes: ['mcuId'] })
        const mcu = await MCU.findByPk(sensor.mcuId, { attributes: ['greenhouseId'] })
        const greenhouse = await Greenhouse.findByPk(mcu.greenhouseId, { attributes: ['userId'] })
        const ws = getWsClient(greenhouse.userId)
        
		if (!ws) return;
		sendWsClient(ws, 'reading', reading, 'Create')

	} catch (error) {
		logger.error(error.message, error)
	}
}



module.exports = {
	onAfterReadingCreate,
}