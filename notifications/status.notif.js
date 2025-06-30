const { logger } = require("../utils/logger.util")
const {
    Alert, Action, Actuator, Condition, MCU,
    Input, Threshold, Output, Greenhouse
} = require("../models/index.model")

//

/** Creates alert about input change of an actuator. */
const onAfterInputUpdate = async (input, options) => {
    try {
        // trigger on change of status only
        const prevInputStatus = input?.previous('status')
        if (!prevInputStatus || !input?.status || prevInputStatus == input?.status) return

        // trace userId
        const actuator = await Actuator.findOne({ where: { id: input?.actuatorId }, attributes: ['id', 'name', 'mcuId'] })
        const mcu = await MCU.findOne({ where: { id: actuator?.mcuId }, attributes: ['id', 'greenhouseId'] })
        const greenhouse = await Greenhouse.findOne({ where: { id: mcu?.greenhouseId }, attributes: ['id', 'userId'] })
        
        // craft content
        const inputTypeToggle = input?.type == 'Boolean'
        const title = `Actuator "${actuator?.name}" Input "${input?.name}" ${inputTypeToggle ? (input?.status == 0 ? "Toggled OFF" : "Toggled ON") : `Set To ${input?.status}`}`
        const msg = `${actuator?.name} input has been `
            + (inputTypeToggle ? `toggled ${input?.status == 0 ? "OFF" : "ON"}` : `set to ${input?.status}`)
            + `.`

        await Alert.create({
            title: title,
            message: msg,
            severity: "Info",
            viewed: false,
            emailed: false,
            greenhouseId: greenhouse?.id,
            userId: greenhouse?.userId
        })

    } catch (error) {
        logger.error(error?.message, error)
    }
}

// COMMENTED DUE TO ITS LIFECYCLE, IT GOES ACTIVE-INACTIVE CONTINUOUSLY EVERY READ DUE TO THRESHOLD
// /** Creates an alert when an action is status becomes active. */
// const onAfterActionUpdate = async (action, options) => {
//     try {
//         if (!action?.status || action?.status != 'Active') return

//         const input = await Input.findOne({ where: { id: action?.inputId }, attributes: ['id', 'name', 'type', 'actuatorId'] })
//         const actuator = await Actuator.findOne({ where: { id: input?.actuatorId }, attributes: ['id', 'name'] })
//         const greenhouse = await Greenhouse.findOne({ where: { id: action?.greenhouseId }, attributes: ['id', 'userId'] })

//         const inputTypeToggle = input?.type == 'Boolean'

//         const title = `Action "${action?.name}" Now Active`
//         let msg = `The action "${action?.name}" is now active.`
//         msg += `This will ${inputTypeToggle ? (action?.value == 0 ? "toggle OFF" : "toggle ON") : (`input ${action.value}`)} `
//         msg += `on the actuator "${actuator?.name}"`
//         msg += ` for ${action?.duration > 0 ? `${action?.duration} milliseconds then will return to its previous state.` : "an indefinite period"}.`

//         await Alert.create({
//             title: title,
//             message: msg,
//             severity: "Info",
//             viewed: false,
//             emailed: false,
//             greenhouseId: greenhouse?.id,
//             userId: greenhouse?.userId
//         })

//     } catch (error) {
//         logger.error(error?.message, error)
//     }
// }

/** Creates an alert when a condition is satisfied. */
const onAfterConditionUpdate = async (condition, options) => {
	try {
		// trigger on change only
		const prevConditionSatisfied = condition?.previous("satisfied")
		if (!condition?.satisfied || prevConditionSatisfied == condition?.satisfied) return

		// trace userId
		const threshold = await Threshold.findOne({ where: { id: condition?.thresholdId }, attributes: ["id", "name", "greenhouseId"] })
		const greenhouse = await Greenhouse.findOne({ where: { id: threshold?.greenhouseId }, attributes: ["id", "userId"] })
		const output = await Output.findOne({ where: { id: condition?.outputId }, attributes: ["id", "name", "unit"] })

		// craft message
		const title = `Output "${output?.name}" Reached ${condition?.type} ${condition?.value}${output?.unit}`
		let msg = `Condition triggered: The output "${output?.name}" reached ${condition?.type.toLowerCase()} the value of ${
			condition?.value
		}${output?.unit}.`
		msg += "Please review the greenhouse status."

		await Alert.create({
			title: title,
			message: msg,
			severity: "Warning",
			viewed: false,
			emailed: false,
			greenhouseId: greenhouse?.id,
			userId: greenhouse?.userId,
		})
	} catch (error) {
		logger.error(error?.message, error)
	}
}

/** Creates an alert when a threshold is activated. */
const onAfterThresholdUpdate = async (threshold, options) => {
	try {
		// trigger on change only
		const prevThreshActivated = threshold?.previous("activated")
		if (!threshold?.activated || prevThreshActivated == threshold?.activated) return

		// trace userId
		const greenhouse = await Greenhouse.findOne({ where: { id: threshold?.greenhouseId }, attributes: ["id", "userId"] })

		// get threshold actions and inputs
		const actions = await Action.findAll({
			where: { thresholdId: threshold?.id },
			attributes: ["id", "name", "value", "delay", "timeout", "duration", "inputId"],
			include: {
				model: Input,
				attributes: ["id", "name", "type", "status", "actuatorId"],
				include: {
					model: Actuator,
					attributes: ["id", "name"],
				},
			},
		})

		// craft message
		const title = `Threshold "${threshold?.name}" Activated`
		let msg = `The threshold "${threshold?.name}" has been activated.`
		msg += `\nActions to be executed:\n`
		msg += actions
			.map(
				(act) =>
					`\t - ${act?.name}: ` +
					(act?.delay > 0 ? `After a delay of ${act?.delay}ms, ` : "Immediately, ") +
					`the input "${act?.Input?.name}" of actuator "${act?.Input?.Actuator?.name}" ` +
					`will be ${
						act?.Input?.type == "Boolean" ? (act?.value == 0 ? "toggled OFF" : "toggled ON") : `set to ${act?.value}`
					} ` +
					(act?.duration == -1
						? "for an indefinite period."
						: `for ${act?.duration}ms and will return to its previous state.`)
			)
			.join("\n")

		await Alert.create({
			title: title,
			message: msg,
			severity: "Warning",
			viewed: false,
			emailed: false,
			greenhouseId: greenhouse?.id,
			userId: greenhouse?.userId,
		})
	} catch (error) {
		logger.error(error?.message, error)
	}
}

/** Binds hooks about status change of condition, and threshold.*/
const notifInitStatus = async () => {
    Input.afterUpdate(onAfterInputUpdate)
    // Action.afterUpdate(onAfterActionUpdate)
	Condition.afterUpdate(onAfterConditionUpdate)
	Threshold.afterUpdate(onAfterThresholdUpdate)
}

//

module.exports = { notifInitStatus }
