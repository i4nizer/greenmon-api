const Input = require("../models/input.model")
const Action = require("../models/action.model")
const Schedule = require("../models/schedule.model")
const { AppError } = require("../utils/app-error.util")



/** Responds with an array of actions. */
const getAction = async (req, res, next) => {
	try {
		const { scheduleId, thresholdId, actionId } = req.query

		const filter = {
			...(scheduleId && { scheduleId }),
			...(thresholdId && { thresholdId }),
			...(actionId && { id: actionId }),
		}

		const actionDocs = await Action.findAll({
			where: filter,
			order: [["precedence", "DESC"]],
		})

		res.json({ actions: actionDocs })
	} catch (error) {
		next(error)
	}
}

/** Responds with create success. */
const postAction = async (req, res, next) => {
	try {
		const { name, value, duration, precedence, inputId, scheduleId, thresholdId } = req.body

		if (!scheduleId && !thresholdId) {
			return next(new AppError(400, "An action must reference a schedule or a threshold."))
		}

		if (scheduleId) {
			const scheduleDoc = await Schedule.findByPk(scheduleId)
			if (!scheduleDoc) return next(new AppError(404, "Schedule not found."))
		}

		if (inputId) {
			const inputDoc = await Input.findByPk(inputId)
			if (!inputDoc) return next(new AppError(404, "Input not found."))
		}

		const actionDoc = await Action.create({ name, value, duration, precedence, inputId, scheduleId, thresholdId })

		res.json({
			text: "Action created successfully.",
			action: actionDoc,
		})
	} catch (error) {
		next(error)
	}
}

/** Responds with update success. */
const patchAction = async (req, res, next) => {
	try {
		const { actionId, name, value, duration, precedence, inputId, scheduleId, thresholdId } = req.body

		const actionDoc = await Action.findByPk(actionId)
		if (!actionDoc) return next(new AppError(404, "Action not found."))

		await actionDoc.update({ name, value, duration, precedence, inputId, scheduleId, thresholdId })

		res.json({ text: "Action updated successfully." })
	} catch (error) {
		next(error)
	}
}

/** Responds with delete success. */
const deleteAction = async (req, res, next) => {
	try {
		const { actionId } = req.query

		const actionDoc = await Action.findByPk(actionId)
		if (!actionDoc) return next(new AppError(404, "Action not found."))

		await actionDoc.destroy()

		res.json({ text: "Action deleted successfully." })
	} catch (error) {
		next(error)
	}
}



module.exports = {
	getAction,
	postAction,
	patchAction,
	deleteAction,
}
