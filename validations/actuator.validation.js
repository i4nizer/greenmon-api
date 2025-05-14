const Joi = require("joi")

/** Requires actuatorId. */
const getActuatorSchema = Joi.object({
	mcuId: Joi.string().optional(),
	actuatorId: Joi.number().integer().optional(),
})

/** Requires name, label, and mcuId. */
const postActuatorSchema = Joi.object({
	name: Joi.string().min(3).max(100).required(),
	label: Joi.string().allow(null).empty("").max(100).optional(),
	disabled: Joi.boolean().optional(),
	mcuId: Joi.string().required(),
})

/** Requires actuatorId and optionally name and label. */
const patchActuatorSchema = Joi.object({
	id: Joi.number().integer().optional(),
	actuatorId: Joi.number().integer().required(),
	name: Joi.string().min(3).max(100).optional(),
	label: Joi.string().allow(null).empty("").max(100).optional(),
	disabled: Joi.boolean().optional(),
})

/** Requires actuatorId. */
const deleteActuatorSchema = Joi.object({
	actuatorId: Joi.number().integer().required(),
})

module.exports = {
    getActuatorSchema,
    postActuatorSchema,
    patchActuatorSchema,
    deleteActuatorSchema,
}