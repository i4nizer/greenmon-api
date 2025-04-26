const Joi = require("joi")

/** Requires greenhouseId and optionally startdt, enddt, and limit. */
const getLogSchema = Joi.object({
	greenhouseId: Joi.number().integer().optional(),
	startdt: Joi.date().iso().optional(),
	enddt: Joi.date().iso().optional(),
	limit: Joi.number().integer().min(1).optional(),
})

module.exports = {
	getLogSchema,
}
