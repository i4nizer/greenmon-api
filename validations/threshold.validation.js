const Joi = require("joi")



/** Requires greenhouseId and optionally thresholdId. */
const getThresholdSchema = Joi.object({
    greenhouseId: Joi.number().integer().optional(),
    thresholdId: Joi.number().integer().optional(),
})

/** Requires name, operator, disabled, and greenhouseId. */
const postThresholdSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    operator: Joi.string().valid("Any", "All").required(),
    disabled: Joi.boolean().optional(),
    greenhouseId: Joi.number().integer().required(),
})

/** Requires thresholdId and optionally name, operator, and disabled. */
const patchThresholdSchema = Joi.object({
    id: Joi.number().integer().optional(),
    thresholdId: Joi.number().integer().required(),
    name: Joi.string().min(3).max(100).optional(),
    operator: Joi.string().valid("Any", "All").optional(),
    disabled: Joi.boolean().optional(),
})

/** Requires thresholdId. */
const deleteThresholdSchema = Joi.object({
    thresholdId: Joi.number().integer().required(),
})



module.exports = {
    getThresholdSchema,
    postThresholdSchema,
    patchThresholdSchema,
    deleteThresholdSchema,
}