const Joi = require("joi")

/** Requires inputId, pinId, or actuatorId */
const getInputSchema = Joi.object({
    inputId: Joi.number().integer().optional(),
    pinId: Joi.number().integer().optional(),
    actuatorId: Joi.number().integer().optional(),
}).or('inputId', 'pinId', 'actuatorId')

/** Requires type, flag, status, pinId, and actuatorId */
const postInputSchema = Joi.object({
    icon: Joi.string().optional(),
    name: Joi.string().min(3).max(100).required(),
    type: Joi.string().valid('Boolean', 'Number').required(),
    flag: Joi.number().required(),
    status: Joi.number().required(),
    pinId: Joi.number().integer().required(),
    actuatorId: Joi.number().integer().required(),
})

/** Requires inputId and optionally type, flag, and status */
const patchInputSchema = Joi.object({
    id: Joi.number().integer().optional(),
	inputId: Joi.number().integer().required(),
	icon: Joi.string().optional(),
	name: Joi.string().min(3).max(100).required(),
	type: Joi.string().min(3).max(50).optional(),
	flag: Joi.number().optional(),
	status: Joi.number().optional(),
	pinId: Joi.number().integer().optional(),
})

/** Requires inputId */
const deleteInputSchema = Joi.object({
    inputId: Joi.number().integer().required(),
})

module.exports = {
    getInputSchema,
    postInputSchema,
    patchInputSchema,
    deleteInputSchema,
}