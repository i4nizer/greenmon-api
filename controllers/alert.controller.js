const { Op } = require("sequelize")
const Alert = require("../models/alert.model")
const { AppError } = require("../utils/app-error.util")

//

/** Responds with an array of alerts. */
const getAlert = async (req, res, next) => {
	try {
		const { userId } = req.accessTokenPayload
		const { greenhouseId, startdt, enddt, viewed, emailed, severity, offset, limit } = req.query

		const filter = {
			...(userId && { userId }),
			...(greenhouseId && { greenhouseId }),
			...(viewed && { viewed: viewed == 'true' }),
			...(emailed && { emailed: emailed == 'true' }),
			...(severity && { severity: { [Op.in]: severity?.split(',') } }),
			...(startdt && { createdAt: { [Alert.sequelize.Op.gte]: new Date(startdt) } }),
			...(enddt && { createdAt: { [Alert.sequelize.Op.lte]: new Date(enddt) } }),
		}

		// find them
		const alertDocs = await Alert.findAll({
			where: filter,
			order: [["createdAt", "DESC"]],
			...(limit && { limit: parseInt(limit, 10) }),
			...(offset && { offset: parseInt(offset, 10) }),
		})

		// send them
		res.json({
			count: await Alert.count({ where: filter }),
			alerts: alertDocs.reverse(),
		})

		// mark them as viewed
		await Alert.update(
			{ viewed: true },
			{
				where: { id: { [Op.in]: alertDocs.map(a => a.id) } },
				individualHooks: true,
				source: 'client',
			}
		)

	} catch (error) {
		next(error)
	}
}

//

module.exports = {
	getAlert,
}
