const Joi = require("joi")



/** Requires sensorId or actionId. */
const getHookSchema = Joi.object({
	sensorId: Joi.number().integer().optional(),
	actionId: Joi.number().integer().optional(),
})

/** Requires type and optionally sensorId or actionId. */
const postHookSchema = Joi.object({
	type: Joi.string().valid("Before", "During", "After").required(),
	sensorId: Joi.number().integer().optional(),
	actionId: Joi.number().integer().optional(),
})

/** Requires hookId and optionally other fields. */
const patchHookSchema = Joi.object({
	hookId: Joi.number().integer().required(),
	type: Joi.string().valid("Before", "During", "After").optional(),
	sensorId: Joi.number().integer().optional(),
	actionId: Joi.number().integer().optional(),
})

/** Requires hookId. */
const deleteHookSchema = Joi.object({
	hookId: Joi.number().integer().required(),
})



module.exports = {
	getHookSchema,
	postHookSchema,
	patchHookSchema,
	deleteHookSchema,
}
