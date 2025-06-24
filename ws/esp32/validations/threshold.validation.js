const Joi = require('joi')

//

const updateThresholdSchema = Joi.object({
    id: Joi.number().integer().required(),
    activated: Joi.boolean().required()
})

//

module.exports = { updateThresholdSchema }