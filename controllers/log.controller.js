const Log = require("../models/log.model")
const { AppError } = require("../utils/app-error.util")

/** Responds with an array of logs. */
const getLog = async (req, res, next) => {
	try {
		const { greenhouseId, startdt, enddt, limit } = req.query

		const filter = {
			...(greenhouseId && { greenhouseId }),
			...(startdt && { createdAt: { [Log.sequelize.Op.gte]: new Date(startdt) } }),
			...(enddt && { createdAt: { [Log.sequelize.Op.lte]: new Date(enddt) } }),
		}

		const logDocs = await Log.findAll({
			where: filter,
			order: [["createdAt", "DESC"]],
			...(limit && { limit: parseInt(limit, 10) }),
		})

		// Reverse the order to sort from oldest to latest
		res.json({ logs: logDocs.reverse() })
	} catch (error) {
		next(error)
	}
}

module.exports = {
	getLog,
}
