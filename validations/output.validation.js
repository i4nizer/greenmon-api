const Joi = require("joi")

/** Requires sensorId */
const getOutputSchema = Joi.object({
    outputId: Joi.string().optional(),
    pinId: Joi.string().optional(),
    sensorId: Joi.string().optional(),
})

/** Requires name, unit, type, pinId, and sensorId. */
const postOutputSchema = Joi.object({
    icon: Joi.string().optional(),
    name: Joi.string().min(3).max(100).required(),
    unit: Joi.string().min(1).max(50).required(),
    type: Joi.string().min(3).max(50).required(),
    pinId: Joi.string().required(),
    sensorId: Joi.string().required(),
})

/** Requires outputId and optionally name, unit, and type. */
const patchOutputSchema = Joi.object({
	outputId: Joi.string().required(),
	icon: Joi.string().optional(),
	name: Joi.string().min(3).max(100).optional(),
	unit: Joi.string().min(1).max(50).optional(),
	type: Joi.string().min(3).max(50).optional(),
	pinId: Joi.string().optional(),
})

/** Requires outputId. */
const deleteOutputSchema = Joi.object({
    outputId: Joi.string().required(),
})

module.exports = {
    getOutputSchema,
    postOutputSchema,
    patchOutputSchema,
    deleteOutputSchema,
}