const Joi = require("joi")

/** Requires inputId, pinId, or actuatorId */
const getInputSchema = Joi.object({
    inputId: Joi.string().optional(),
    pinId: Joi.string().optional(),
    actuatorId: Joi.string().optional(),
}).or('inputId', 'pinId', 'actuatorId')

/** Requires type, flag, status, pinId, and actuatorId */
const postInputSchema = Joi.object({
    icon: Joi.string().optional(),
    name: Joi.string().min(3).max(100).required(),
    type: Joi.string().valid('Boolean', 'Number').required(),
    flag: Joi.number().required(),
    status: Joi.number().required(),
    pinId: Joi.string().required(),
    actuatorId: Joi.string().required(),
})

/** Requires inputId and optionally type, flag, and status */
const patchInputSchema = Joi.object({
    inputId: Joi.string().required(),
    icon: Joi.string().optional(),
    name: Joi.string().min(3).max(100).required(),
	type: Joi.string().min(3).max(50).optional(),
	flag: Joi.number().optional(),
	status: Joi.number().optional(),
	pinId: Joi.string().optional(),
})

/** Requires inputId */
const deleteInputSchema = Joi.object({
    inputId: Joi.string().required(),
})

module.exports = {
    getInputSchema,
    postInputSchema,
    patchInputSchema,
    deleteInputSchema,
}