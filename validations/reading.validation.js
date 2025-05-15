const Joi = require("joi")

/** Requires outputId and optionally startdt, enddt, and limit. */
const getReadingSchema = Joi.object({
	outputId: Joi.number().integer().optional(),
	greenhouseId: Joi.number().integer().optional(),
	startdt: Joi.date().iso().optional(),
	enddt: Joi.date().iso().optional(),
	limit: Joi.number().integer().min(1).optional(),
})

module.exports = {
	getReadingSchema,
}
