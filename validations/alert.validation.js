const Joi = require("joi")

/** Requires greenhouseId or userId and optionally startdt, enddt, and limit. */
const getAlertSchema = Joi.object({
	greenhouseId: Joi.number().integer().optional(),
	userId: Joi.number().integer().optional(),
	startdt: Joi.date().iso().optional(),
	enddt: Joi.date().iso().optional(),
	limit: Joi.number().integer().min(1).optional(),
})

module.exports = {
	getAlertSchema,
}
