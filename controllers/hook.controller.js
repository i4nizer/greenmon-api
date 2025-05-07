const Hook = require("../models/hook.model")
const { AppError } = require("../utils/app-error.util")

//

/** Responds with an array of hooks. */
const getHook = async (req, res, next) => {
	try {
		const { sensorId, actionId } = req.query

		const filter = {
			...(sensorId && { sensorId }),
			...(actionId && { actionId }),
		}

		const hookDocs = await Hook.findAll({ where: filter })

		res.json({ hooks: hookDocs })
	} catch (error) {
		next(error)
	}
}

/** Responds with create success. */
const postHook = async (req, res, next) => {
	try {
		const { type, sensorId, actionId } = req.body

		const hookDoc = await Hook.create({ type, sensorId, actionId })

		res.json({
			text: "Hook created successfully.",
			hook: hookDoc,
		})
	} catch (error) {
		next(error)
	}
}

/** Responds with update success. */
const patchHook = async (req, res, next) => {
	try {
		const { hookId, type, sensorId, actionId } = req.body

		const hookDoc = await Hook.findByPk(hookId)
		if (!hookDoc) return next(new AppError(404, "Hook not found."))

		await hookDoc.update({ type, sensorId, actionId })

		res.json({ text: "Hook updated successfully." })
	} catch (error) {
		next(error)
	}
}

/** Responds with delete success. */
const deleteHook = async (req, res, next) => {
	try {
		const { hookId } = req.query

		const hookDoc = await Hook.findByPk(hookId)
		if (!hookDoc) return next(new AppError(404, "Hook not found."))

		await hookDoc.destroy()

		res.json({ text: "Hook deleted successfully." })
	} catch (error) {
		next(error)
	}
}

//

module.exports = {
	getHook,
	postHook,
	patchHook,
	deleteHook,
}
