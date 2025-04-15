const { logger } = require('../../../utils/logger.util')
const { sendWsEsp32, getWsEsp32 } = require('../util.ws')
const { Greenhouse, MCU, Output, Condition } = require('../../../models/index.model')



/**
 * Sends created sensor to esp32.
 */
const onAfterSensorCreate = async (sensor, options) => {
    try {
        const mcu = await MCU.findByPk(sensor.mcuId)
		const greenhouse = await Greenhouse.findByPk(mcu.greenhouseId)
		const ws = getWsEsp32(greenhouse.key)
		
		if (!ws) return;
		sendWsEsp32(ws, 'sensor', sensor, 'Create')

	} catch (error) {
		logger.error(error.message, error)
	}
}

/**
 * Sends updated sensor to esp32.
 */
const onAfterSensorUpdate = async (sensor, options) => {
	try {
		const mcu = await MCU.findByPk(sensor.mcuId)
		const greenhouse = await Greenhouse.findByPk(mcu.greenhouseId)
		const ws = getWsEsp32(greenhouse.key)
		
		if (!ws) return;
		sendWsEsp32(ws, 'sensor', sensor, 'Update')

	} catch (error) {
		logger.error(error.message, error)
	}
}

/**
 * Sends sensor cascade delete to esp32.
 */
const onBeforeSensorDelete = async (sensor, options) => {
	try {
		const mcu = await MCU.findByPk(sensor.mcuId)
		const greenhouse = await Greenhouse.findByPk(mcu.greenhouseId)
		const ws = getWsEsp32(greenhouse.key)
		if (!ws) return;

		// delete sensor
		sendWsEsp32(ws, 'sensor', sensor, 'Delete')
		
        // delete sensor outputs
        const outputs = await Output.findAll({ where: { sensorId: sensor.id } })
        sendWsEsp32(ws, 'output', [{ sensorId: sensor.id }], 'Delete')

        // delete sensors outputs conditions
		sendWsEsp32(ws, 'condition', outputs.map(o => ({ outputId: o.id })), 'Delete')

	} catch (error) {
		logger.error(error.message, error)
	}
}



module.exports = {
	onAfterSensorCreate,
	onAfterSensorUpdate,
	onBeforeSensorDelete,
}