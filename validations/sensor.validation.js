const Joi = require("joi")

/** Requires sensorId. */
const getSensorSchema = Joi.object({
	mcuId: Joi.string().optional(),
    sensorId: Joi.string().required(),
})

/** Requires name, label, mcuId, and outputs. */
const postSensorSchema = Joi.object({
	name: Joi.string().min(3).max(100).required(),
	label: Joi.string().min(3).max(100).required(),
	interval: Joi.number().min(0).optional(),
	disabled: Joi.boolean().optional(),
	mcuId: Joi.string().required(),
})

/** Requires sensorId and optionally name and label. */
const patchSensorSchema = Joi.object({
	sensorId: Joi.string().required(),
	name: Joi.string().min(3).max(100).optional(),
	label: Joi.string().min(3).max(100).optional(),
	interval: Joi.number().min(0).optional(),
	disabled: Joi.boolean().optional(),
})

/** Requires sensorId. */
const deleteSensorSchema = Joi.object({
    sensorId: Joi.string().required(),
})

module.exports = {
    getSensorSchema,
    postSensorSchema,
    patchSensorSchema,
    deleteSensorSchema,
}