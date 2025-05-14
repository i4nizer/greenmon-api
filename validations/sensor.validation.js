const Joi = require("joi")

/** Requires sensorId. */
const getSensorSchema = Joi.object({
	mcuId: Joi.number().integer().optional(),
    sensorId: Joi.number().integer().optional(),
})

/** Requires name, label, mcuId, and outputs. */
const postSensorSchema = Joi.object({
	name: Joi.string().min(3).max(100).required(),
	label: Joi.string().allow(null).empty("").max(100).optional(),
	interval: Joi.number().min(0).optional(),
	lastread: Joi.number().integer().optional(),
	readphase: Joi.string().optional(),
	disabled: Joi.boolean().optional(),
	mcuId: Joi.number().integer().required(),
})

/** Requires sensorId and optionally name and label. */
const patchSensorSchema = Joi.object({
	id: Joi.number().integer().optional(),
	sensorId: Joi.number().integer().required(),
	name: Joi.string().min(3).max(100).optional(),
	label: Joi.string().allow(null).empty('').max(100).optional(),
	interval: Joi.number().min(0).optional(),
	lastread: Joi.number().integer().optional(),
	readphase: Joi.string().optional(),
	disabled: Joi.boolean().optional(),
	mcuId: Joi.number().integer().optional(),
})

/** Requires sensorId. */
const deleteSensorSchema = Joi.object({
	sensorId: Joi.number().integer().required(),
})

module.exports = {
    getSensorSchema,
    postSensorSchema,
    patchSensorSchema,
    deleteSensorSchema,
}