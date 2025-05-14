const Joi = require("joi")

/** Requires name. */
const postGreenhouseSchema = Joi.object({
	name: Joi.string().min(3).max(100).required(),
	description: Joi.string().max(500).optional(),
})

/** Requires greenhouseId. */
const patchGreenhouseSchema = Joi.object({
	id: Joi.number().integer().optional(),
	greenhouseId: Joi.string().required(),
	name: Joi.string().min(3).max(100).optional(),
	description: Joi.string().max(500).optional(),
})

module.exports = {
	postGreenhouseSchema,
	patchGreenhouseSchema,
}
