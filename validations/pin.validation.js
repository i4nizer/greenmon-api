const Joi = require("joi")



/** Requires type, mode, number, and mcuId. */
const postPinSchema = Joi.object({
	type: Joi.string().valid("Digital", "Analog").required(),
	mode: Joi.string().valid("Unset", "Input", "Output", "Other").required(),
	number: Joi.number().required(),
	mcuId: Joi.number().integer().required(),
})

/** Requires pinId and optionally type, mode, and number. */
const patchPinSchema = Joi.object({
	id: Joi.number().integer().optional(),
	pinId: Joi.number().integer().required(),
	type: Joi.string().valid("Digital", "Analog").optional(),
	mode: Joi.string().valid("Unset", "Input", "Output", "Other").optional(),
	number: Joi.number().optional(),
})

/** Requires pinId. */
const deletePinSchema = Joi.object({
	pinId: Joi.number().integer().required(),
})

/** Requires mcuId and optionally pinId. */
const getPinSchema = Joi.object({
	mcuId: Joi.number().integer().required(),
	pinId: Joi.number().integer().optional(),
})



module.exports = {
	postPinSchema,
	patchPinSchema,
	deletePinSchema,
	getPinSchema,
}
