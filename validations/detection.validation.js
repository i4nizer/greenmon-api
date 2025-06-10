const Joi = require("joi")

//

/** Allows filtering by imageId, class, limit, and offset. */
const getDetectionSchema = Joi.object({
	detectionId: Joi.number().integer().optional(),
	imageId: Joi.number().integer().optional(),
	class: Joi.string().optional(),
	limit: Joi.number().integer().min(1).optional(),
	offset: Joi.number().integer().min(0).optional(),
	image: Joi.boolean().optional(),
	greenhouseId: Joi.number().integer().optional(),
})

//

module.exports = {
	getDetectionSchema,
}
