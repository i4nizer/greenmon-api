const Joi = require("joi")

//

/** Requires cameraId. */
const getCameraSchema = Joi.object({
    cameraId: Joi.number().integer().optional(),
    greenhouseId: Joi.number().integer().optional(),
})

/** Requires name, label, key, detect, interval, disabled, connected, greenhouseId. */
const postCameraSchema = Joi.object({
	name: Joi.string().min(3).max(100).required(),
	label: Joi.string().allow(null).max(100).optional(),
	key: Joi.string().allow(null).optional(),
	detect: Joi.boolean().optional(),
	interval: Joi.number().integer().required(),
	format: Joi.string().required(),
	quality: Joi.number().integer().required(),
	resolution: Joi.string().required(),
	realtime: Joi.boolean().optional(),
	disabled: Joi.boolean().optional(),
	connected: Joi.boolean().optional(),
	greenhouseId: Joi.number().integer().required(),
})

/** Requires cameraId and optionally name, label, key, detect, interval, disabled, connected. */
const patchCameraSchema = Joi.object({
	cameraId: Joi.number().integer().required(),
	name: Joi.string().min(3).max(100).optional(),
	label: Joi.string().allow(null).max(100).optional(),
	key: Joi.string().allow(null).optional(),
	detect: Joi.boolean().optional(),
	interval: Joi.number().integer().optional(),
	format: Joi.string().allow(null).optional(),
	quality: Joi.number().integer().optional(),
	resolution: Joi.string().optional(),
	realtime: Joi.boolean().optional(),
	disabled: Joi.boolean().optional(),
	connected: Joi.boolean().optional(),
	greenhouseId: Joi.number().integer().optional(),
})

/** Requires cameraId. */
const deleteCameraSchema = Joi.object({
	cameraId: Joi.number().integer().required(),
})

//

module.exports = {
    getCameraSchema,
	postCameraSchema,
	patchCameraSchema,
	deleteCameraSchema,
}
