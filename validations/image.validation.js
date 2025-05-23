const Joi = require("joi")

//

/** Allows filtering by cameraId, greenhouseId, year, month, limit, and offset. */
const getImageSchema = Joi.object({
	cameraId: Joi.number().integer().optional(),
	greenhouseId: Joi.number().integer().optional(),
	year: Joi.number().integer().min(1970).max(new Date().getFullYear()).optional(),
	month: Joi.number().integer().min(0).max(11).optional(),
	limit: Joi.number().integer().min(1).optional(),
	offset: Joi.number().integer().min(0).optional(),
})

//

module.exports = {
	getImageSchema,
}
