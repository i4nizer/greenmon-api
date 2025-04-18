const { logger } = require('../../../utils/logger.util')
const { sendWsEsp32, getWsEsp32 } = require('../util.ws')
const { Greenhouse, MCU, Actuator, Input, Action } = require('../../../models/index.model')



/**
 * Sends created actuator to esp32.
 */
const onAfterActuatorCreate = async (actuator, options) => {
    try {
        const mcu = await MCU.findByPk(actuator.mcuId)
		const greenhouse = await Greenhouse.findByPk(mcu.greenhouseId)
		const ws = getWsEsp32(greenhouse.key)
		
		if (!ws) return;
		sendWsEsp32(ws, 'actuator', actuator, 'Create')

	} catch (error) {
		logger.error(error.message, error)
	}
}

/**
 * Sends updated actuator to esp32.
 */
const onAfterActuatorUpdate = async (actuator, options) => {
	try {
		const mcu = await MCU.findByPk(actuator.mcuId)
		const greenhouse = await Greenhouse.findByPk(mcu.greenhouseId)
		const ws = getWsEsp32(greenhouse.key)
		
		if (!ws) return;
		sendWsEsp32(ws, 'actuator', actuator, 'Update')

	} catch (error) {
		logger.error(error.message, error)
	}
}

/**
 * Sends actuator cascade delete to esp32.
 */
const onBeforeActuatorDelete = async (actuator, options) => {
	try {
		const mcu = await MCU.findByPk(actuator.mcuId)
		const greenhouse = await Greenhouse.findByPk(mcu.greenhouseId)
		const ws = getWsEsp32(greenhouse.key)
		if (!ws) return;

		// delete actuator
		sendWsEsp32(ws, 'actuator', actuator, 'Delete')
		
        // delete actuators inputs
		const inputs = await Input.findAll({ where: { actuatorId: actuator.id } })
		sendWsEsp32(ws, 'input', [{ actuatorId: actuator.id }], 'Delete')

		// delete actuator inputs actions
		sendWsEsp32(ws, 'action', inputs.map(i => ({ inputId: i.id })), 'Delete')

	} catch (error) {
		logger.error(error.message, error)
	}
}



module.exports = {
	onAfterActuatorCreate,
	onAfterActuatorUpdate,
	onBeforeActuatorDelete,
}