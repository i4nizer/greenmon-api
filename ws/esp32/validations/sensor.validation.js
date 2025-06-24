const Joi = require('joi')

//

const updateSensorSchema = Joi.object({
	id: Joi.number().integer().required(),
	readphase: Joi.string().allow("Off", "Before", "During", "After"),
})

//

module.exports = { updateSensorSchema }