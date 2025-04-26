const Alert = require("../models/alert.model")
const { AppError } = require("../utils/app-error.util")

/** Responds with an array of alerts. */
const getAlert = async (req, res, next) => {
	try {
		const { greenhouseId, userId, startdt, enddt, limit } = req.query

		const filter = {
			...(greenhouseId && { greenhouseId }),
			...(userId && { userId }),
			...(startdt && { createdAt: { [Alert.sequelize.Op.gte]: new Date(startdt) } }),
			...(enddt && { createdAt: { [Alert.sequelize.Op.lte]: new Date(enddt) } }),
		}

		const alertDocs = await Alert.findAll({
			where: filter,
			order: [["createdAt", "DESC"]],
			...(limit && { limit: parseInt(limit, 10) }),
		})

		res.json({ alerts: alertDocs.reverse() })
	} catch (error) {
		next(error)
	}
}

module.exports = {
	getAlert,
}
