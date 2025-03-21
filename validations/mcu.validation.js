const Joi = require("joi")

/** Requires name, label, key, pins, and greenhouseId. */
const postMcuSchema = Joi.object({
	name: Joi.string().min(3).max(100).required(),
	label: Joi.string().min(3).max(100).required(),
	pins: Joi.array()
		.items(
			Joi.object({
				type: Joi.string().valid("Digital", "Analog").required(),
				number: Joi.number().required(),
			})
		)
		.required(),
	greenhouseId: Joi.string().required(),
})

/** Requires mcuId and optionally name, label, and key. */
const patchMcuSchema = Joi.object({
	mcuId: Joi.string().required(),
	name: Joi.string().min(3).max(100).optional(),
	label: Joi.string().min(3).max(100).optional(),
})

/** Requires mcuId. */
const deleteMcuSchema = Joi.object({
	mcuId: Joi.string().required(),
})

module.exports = {
	postMcuSchema,
	patchMcuSchema,
	deleteMcuSchema,
}
