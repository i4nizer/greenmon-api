const { createToken } = require("../services/token.service")
const Greenhouse = require("../models/greenhouse.model")
const { AppError } = require("../utils/app-error.util")
const env = require("../configs/env.config")

//

/** Responds with an array of greenhouses. */
const getGreenhouse = async (req, res, next) => {
	try {
		const { userId } = req.accessTokenPayload
		const { greenhouseId } = req.query
		const filter = greenhouseId ? { id: greenhouseId, userId } : { userId }

		const greenhouseDocs = await Greenhouse.findAll({ where: filter })

		res.json({ greenhouses: greenhouseDocs })
	} catch (error) {
		next(error)
	}
}

/** Responds with create success. */
const postGreenhouse = async (req, res, next) => {
	try {
		const { userId } = req.accessTokenPayload
		const { name, description } = req.body

		const greenhouseDoc = await Greenhouse.create({ userId, name, description, key: "Temporary Key" })
		const { tokenStr: key } = await createToken(userId, { greenhouseId: greenhouseDoc.id }, "Api", env.apiLife)
		await greenhouseDoc.update({ key })

		res.json({
			text: "Greenhouse created successfully.",
			greenhouse: greenhouseDoc,
		})
	} catch (error) {
		next(error)
	}
}

/** Responds with update success. */
const patchGreenhouse = async (req, res, next) => {
	try {
		const { userId } = req.accessTokenPayload
		const { greenhouseId, name, description } = req.body
		const filter = greenhouseId ? { id: greenhouseId, userId } : { userId }

		const [updatedRows] = await Greenhouse.update({ name, description }, { where: filter })

		if (!updatedRows) return next(new AppError(404, "Greenhouse not found."))

		res.json({ text: "Greenhouse updated successfully." })
	} catch (error) {
		next(error)
	}
}

/** Responds with delete success. */
const deleteGreenhouse = async (req, res, next) => {
	try {
		const { userId } = req.accessTokenPayload
		const { greenhouseId } = req.query

		const deletedRows = await Greenhouse.destroy({ where: { userId, id: greenhouseId } })

		if (!deletedRows) return next(new AppError(404, "Greenhouse not found."))

		res.json({ text: "Greenhouse deleted successfully." })
	} catch (error) {
		next(error)
	}
}

//

module.exports = {
	getGreenhouse,
	postGreenhouse,
	patchGreenhouse,
	deleteGreenhouse,
}
