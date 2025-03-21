const Joi = require("joi")



/** Requires type, mode, number, and mcuId. */
const postPinSchema = Joi.object({
	type: Joi.string().valid("Digital", "Analog").required(),
	mode: Joi.string().valid("Unset", "Input", "Output", "Other").required(),
	number: Joi.number().required(),
	mcuId: Joi.number().required(),
})

/** Requires pinId and optionally type, mode, and number. */
const patchPinSchema = Joi.object({
	pinId: Joi.number().required(),
	type: Joi.string().valid("Digital", "Analog").optional(),
	mode: Joi.string().valid("Unset", "Input", "Output", "Other").optional(),
	number: Joi.number().optional(),
})

/** Requires pinId. */
const deletePinSchema = Joi.object({
	pinId: Joi.number().required(),
})

/** Requires mcuId and optionally pinId. */
const getPinSchema = Joi.object({
	mcuId: Joi.number().required(),
	pinId: Joi.number().optional(),
})



module.exports = {
	postPinSchema,
	patchPinSchema,
	deletePinSchema,
	getPinSchema,
}
