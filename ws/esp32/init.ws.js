const { logger } = require('../../utils/logger.util')
const {
    MCU, Pin, Sensor, Output, Hook,
    Actuator, Input, Schedule,
    Threshold, Condition, Action,
} = require('../../models/index.model')
const { WebSocketClient } = require('../wsclient.ws')

//

/**
 * @param {WebSocketClient} wsClient This is the uninitialized web socket client.
 */
const sendWsEsp32InitialData = async (wsClient) => {
	const { userId, greenhouseId } = wsClient.payload

	// benchmarking
	const ms = Date.now()

	// find all mcus
	const mcus = await MCU.findAll({ where: { greenhouseId } })
	await wsClient.sendChunkedAsync('mcu', mcus, 'Create', 10, 50, true)

	for (const mcu of mcus) {

        // find all pins
		const pins = await Pin.findAll({ where: { mcuId: mcu.id } })
		await wsClient.sendChunkedAsync('pin', pins, 'Create', 10, 50, true)

		// find all sensors
		const sensors = await Sensor.findAll({ where: { mcuId: mcu.id } })
		await wsClient.sendChunkedAsync('sensor', sensors, "Create", 10, 50, true)

		for (const sensor of sensors) {
			
			// find all outputs
			const outputs = await Output.findAll({ where: { sensorId: sensor.id } })
			await wsClient.sendChunkedAsync('output', outputs, "Create", 10, 50, true)
			
			// find all hooks
			const hooks = await Hook.findAll({ where: { sensorId: sensor.id } })
			await wsClient.sendChunkedAsync('hook', hooks, "Create", 10, 50, true)
		}

		// find all actuators
		const actuators = await Actuator.findAll({ where: { mcuId: mcu.id } })
		await wsClient.sendChunkedAsync('actuator', actuators, "Create", 10, 50, true)

		for (const actuator of actuators) {
			
			// find all inputs
			const inputs = await Input.findAll({ where: { actuatorId: actuator.id } })
			await wsClient.sendChunkedAsync('input', inputs, "Create", 10, 50, true)
		}
	}

	// find all schedules
	const schedules = await Schedule.findAll({ where: { greenhouseId } })
	await wsClient.sendChunkedAsync('schedule', schedules, "Create", 10, 50, true)
	
	for (const schedule of schedules) {

		// find all actions
		const actions = await Action.findAll({ where: { scheduleId: schedule.id } })
		await wsClient.sendChunkedAsync('action', actions, "Create", 10, 50, true)
	}

	// find all thresholds
	const thresholds = await Threshold.findAll({ where: { greenhouseId } })
	await wsClient.sendChunkedAsync('threshold', thresholds, "Create", 10, 50, true) 

	for (const threshold of thresholds) {

		// find all actions
		const actions = await Action.findAll({ where: { thresholdId: threshold.id } })
		await wsClient.sendChunkedAsync('action', actions, "Create", 10, 50, true)
			
		// find all conditions
		const conditions = await Condition.findAll({ where: { thresholdId: threshold.id } })
		await wsClient.sendChunkedAsync('condition', conditions, 'Create', 10, 50, true)
	}
	
	// benchmark
	const diff = Date.now() - ms
	logger.info(`Web socket initialized with an execution time of ${diff} ms.`)
}

//

module.exports = {
    sendWsEsp32InitialData,
}