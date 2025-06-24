const Joi = require('joi')

//

const updateInputSchema = Joi.object({
    id: Joi.number().integer().required(),
    flag: Joi.number().integer().required(),
    status: Joi.number().integer().required(),
})

//

module.exports = { updateInputSchema }