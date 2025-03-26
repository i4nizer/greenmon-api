const Joi = require("joi")

/** Requires actuatorId. */
const getActuatorSchema = Joi.object({
    mcuId: Joi.string().optional(),
    actuatorId: Joi.string().required(),
})

/** Requires name, label, and mcuId. */
const postActuatorSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    label: Joi.string().min(3).max(100).required(),
    mcuId: Joi.string().required(),
})

/** Requires actuatorId and optionally name and label. */
const patchActuatorSchema = Joi.object({
    actuatorId: Joi.string().required(),
    name: Joi.string().min(3).max(100).optional(),
    label: Joi.string().min(3).max(100).optional(),
})

/** Requires actuatorId. */
const deleteActuatorSchema = Joi.object({
    actuatorId: Joi.string().required(),
})

module.exports = {
    getActuatorSchema,
    postActuatorSchema,
    patchActuatorSchema,
    deleteActuatorSchema,
}