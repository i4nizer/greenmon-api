const { logger } = require('../../utils/logger.util')
const { sendWsEsp32 } = require('./util.ws')
const {
    MCU, Pin, Sensor, Output,
    Actuator, Input, Schedule,
    Threshold, Condition, Action,
} = require('../../models/index.model')



/**
 * @param {WebSocket} ws This is the websocket client to send to.
 * @param {{ userId: Number, greenhouseId: Number }} payload This is the payload of the token of authorized client.
 */
const sendWsEsp32InitialData = async (ws, payload) => {
	const delay = (ms) => new Promise((res) => setTimeout(() => res(), ms))
	const { userId, greenhouseId } = payload

	// benchmarking
	const start = process.hrtime()

	// send time first
	const now = new Date()
	sendWsEsp32(ws, 'time', [{ time: now.toISOString() }], 'Create')
	await delay(20)

	// find all mcus
	const mcus = await MCU.findAll({ where: { greenhouseId } })
	sendWsEsp32(ws, 'mcu', mcus, 'Create')
	await delay(mcus.length * 5)

	for (const mcu of mcus) {

        // find all pins
		const pins = await Pin.findAll({ where: { mcuId: mcu.id } })
		sendWsEsp32(ws, 'pin', pins, 'Create')
		await delay(pins.length * 5)

		// find all sensors
		const sensors = await Sensor.findAll({ where: { mcuId: mcu.id } })
		sendWsEsp32(ws, 'sensor', sensors, "Create")
		await delay(sensors.length * 5)

		for (const sensor of sensors) {
			
			// find all outputs
			const outputs = await Output.findAll({ whre: { sensorId: sensor.id } })
			sendWsEsp32(ws, 'output', outputs, "Create")
			await delay(outputs.length * 5)
		}

		// find all actuators
		const actuators = await Actuator.findAll({ where: { mcuId: mcu.id } })
		sendWsEsp32(ws, 'actuator', actuators, "Create")
		await delay(actuators.length * 5)

		for (const actuator of actuators) {
			
			// find all inputs
			const inputs = await Input.findAll({ where: { actuatorId: actuator.id } })
			sendWsEsp32(ws, 'input', inputs, "Create")
			await delay(inputs.length * 5)
		}
	}

	// find all schedules
	const schedules = await Schedule.findAll({ where: { greenhouseId } })
	sendWsEsp32(ws, 'schedule', schedules, "Create")
	await delay(schedules.length * 5)
	
	for (const schedule of schedules) {

		// find all actions
		const actions = await Action.findAll({ where: { scheduleId: schedule.id } })
		sendWsEsp32(ws, 'action', actions, "Create")
		await delay(actions.length * 5)
	}

	// find all thresholds
	const thresholds = await Threshold.findAll({ where: { greenhouseId } })
	sendWsEsp32(ws, 'threshold', thresholds, "Create") 
	await delay(thresholds.length * 5)

	for (const threshold of thresholds) {

		// find all actions
		const actions = await Action.findAll({ where: { thresholdId: threshold.id } })
		sendWsEsp32(ws, 'action', actions, "Create")
		await delay(actions.length * 5)
			
		// find all conditions
		const conditions = await Condition.findAll({ where: { thresholdId: threshold.id } })
		sendWsEsp32(ws, 'condition', conditions, 'Create')
		await delay(conditions.length * 5)
	}
	
	// benchmark
	const diff = process.hrtime(start)
	logger.info(`Web socket initialized with an execution time of ${diff[0] * 1e3 + diff[1] / 1e6} ms.`)
}



module.exports = {
    sendWsEsp32InitialData,
}