const Joi = require("joi")

/** Requires sensorId. */
const getSensorSchema = Joi.object({
    sensorId: Joi.string().required(),
})

/** Requires name, label, mcuId, and outputs. */
const postSensorSchema = Joi.object({
	name: Joi.string().min(3).max(100).required(),
	label: Joi.string().min(3).max(100).required(),
	mcuId: Joi.string().required(),
})

/** Requires sensorId and optionally name and label. */
const patchSensorSchema = Joi.object({
    sensorId: Joi.string().required(),
    name: Joi.string().min(3).max(100).optional(),
    label: Joi.string().min(3).max(100).optional(),
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