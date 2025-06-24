const Joi = require('joi')

//

const updateActionSchema = Joi.object({
	id: Joi.number().integer().required(),
	status: Joi.string().allow("Inactive", "Delayed", "Active", "Discarded", "Interrupted", "Timeout"),
})

//

module.exports = {
    updateActionSchema
}