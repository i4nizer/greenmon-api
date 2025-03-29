const Joi = require("joi")

/** Requires thresholdId and optionally conditionId. */
const getConditionSchema = Joi.object({
    thresholdId: Joi.number().integer().optional(),
    conditionId: Joi.number().integer().optional(),
})

/** Requires type, value, outputId, and thresholdId. */
const postConditionSchema = Joi.object({
    type: Joi.string().valid("Equal", "Above", "Below").required(),
    value: Joi.number().integer().required(),
    outputId: Joi.number().integer().required(),
    thresholdId: Joi.number().integer().required(),
})

/** Requires conditionId and optionally type, value, and outputId. */
const patchConditionSchema = Joi.object({
    conditionId: Joi.number().integer().required(),
    type: Joi.string().valid("Equal", "Above", "Below").optional(),
    value: Joi.number().integer().optional(),
    outputId: Joi.number().integer().optional(),
})

/** Requires conditionId. */
const deleteConditionSchema = Joi.object({
    conditionId: Joi.number().integer().required(),
})

module.exports = {
    getConditionSchema,
    postConditionSchema,
    patchConditionSchema,
    deleteConditionSchema,
}