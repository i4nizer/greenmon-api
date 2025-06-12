const Joi = require("joi")

//

/** Allows filtering by cameraId, greenhouseId, year, month, limit, and offset. */
const getImageSchema = Joi.object({
	imageId: Joi.number().integer().optional(),
	cameraId: Joi.number().integer().optional(),
	greenhouseId: Joi.number().integer().optional(),
	year: Joi.number().integer().min(1970).max(new Date().getFullYear()).optional(),
	month: Joi.number().integer().min(0).max(11).optional(),
	limit: Joi.number().integer().min(1).optional(),
	offset: Joi.number().integer().min(0).optional(),
	detection: Joi.boolean().optional().default(false),
	classes: Joi.string().optional(),
})

/** Checks filename. */
const getImageUploadSchema = Joi.object({
	filename: Joi.string().required(),
})

//

module.exports = {
	getImageSchema,
	getImageUploadSchema,
}
