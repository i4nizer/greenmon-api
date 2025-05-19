const Joi = require("joi")

//

/** Allows filtering by imageId, class, limit, and offset. */
const getDetectionSchema = Joi.object({
	imageId: Joi.number().integer().required(),
	class: Joi.string().optional(),
})

//

module.exports = {
	getDetectionSchema,
}
