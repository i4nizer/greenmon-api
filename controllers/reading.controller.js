const Reading = require("../models/reading.model")
const { AppError } = require("../utils/app-error.util")

/** Responds with an array of readings. */
const getReading = async (req, res, next) => {
	try {
		const { outputId, startdt, enddt, limit } = req.query

		const filter = {
			...(outputId && { outputId }),
			...(startdt && { createdAt: { [Reading.sequelize.Op.gte]: new Date(startdt) } }),
			...(enddt && { createdAt: { [Reading.sequelize.Op.lte]: new Date(enddt) } }),
		}

		const readingDocs = await Reading.findAll({
			where: filter,
			order: [["createdAt", "DESC"]],
			...(limit && { limit: parseInt(limit, 10) }),
		})

		res.json({ readings: readingDocs.reverse() })
	} catch (error) {
		next(error)
	}
}

module.exports = {
	getReading,
}
