const Joi = require("joi")

/** Requires scheduleId and optionally actionId. */
const getActionSchema = Joi.object({
    scheduleId: Joi.number().integer().optional(),
    thresholdId: Joi.number().integer().optional(),
    greenhouseId: Joi.number().integer().optional(),
    actionId: Joi.number().integer().optional(),
})

/** Requires name, value, duration, inputId, and either scheduleId or thresholdId. */
const postActionSchema = Joi.object({
    name: Joi.string().required(),
    value: Joi.number().integer().required(),
    delay: Joi.number().integer().optional(),
    duration: Joi.number().integer().required(),
    precedence: Joi.number().integer().optional(),
    inputId: Joi.number().integer().required(),
    scheduleId: Joi.number().integer().optional(),
    thresholdId: Joi.number().integer().optional(),
    greenhouseId: Joi.number().integer().optional(),
})

/** Requires actionId and optionally other fields. */
const patchActionSchema = Joi.object({
	actionId: Joi.number().integer().required(),
	name: Joi.string().optional(),
	value: Joi.number().integer().optional(),
	delay: Joi.number().integer().optional(),
	duration: Joi.number().integer().optional(),
	precedence: Joi.number().integer().optional(),
	inputId: Joi.number().integer().optional(),
	scheduleId: Joi.number().integer().optional(),
	thresholdId: Joi.number().integer().optional(),
	greenhouseId: Joi.number().integer().optional(),
})

/** Requires actionId. */
const deleteActionSchema = Joi.object({
    actionId: Joi.number().integer().required(),
})

module.exports = {
    getActionSchema,
    postActionSchema,
    patchActionSchema,
    deleteActionSchema,
}