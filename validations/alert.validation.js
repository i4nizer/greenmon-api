const Joi = require("joi")

/** Requires greenhouseId or userId and optionally startdt, enddt, and limit. */
const getAlertSchema = Joi.object({
	greenhouseId: Joi.number().integer().optional(),
	viewed: Joi.boolean().optional(),
	emailed: Joi.boolean().optional(),
	severity: Joi.string().optional(),
	startdt: Joi.date().iso().optional(),
	enddt: Joi.date().iso().optional(),
	offset: Joi.number().integer().optional(),
	limit: Joi.number().integer().min(1).optional(),
})

module.exports = {
	getAlertSchema,
}
