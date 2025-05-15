const Joi = require("joi")

/** Requires name, label, key, pins, and greenhouseId. */
const postMcuSchema = Joi.object({
	name: Joi.string().min(3).max(100).required(),
	label: Joi.string().allow(null).max(100).optional(),
	pins: Joi.array()
		.items(
			Joi.object({
				type: Joi.string().valid("Digital", "Analog").required(),
				number: Joi.number().integer().required(),
			})
		)
		.required(),
	greenhouseId: Joi.number().integer().required(),
})

/** Requires mcuId and optionally name, label, and key. */
const patchMcuSchema = Joi.object({
	id: Joi.number().integer().optional(),
	mcuId: Joi.number().integer().required(),
	name: Joi.string().min(3).max(100).optional(),
	label: Joi.string().allow(null).max(100).optional(),
})

/** Requires mcuId. */
const deleteMcuSchema = Joi.object({
	mcuId: Joi.number().integer().required(),
})

module.exports = {
	postMcuSchema,
	patchMcuSchema,
	deleteMcuSchema,
}
