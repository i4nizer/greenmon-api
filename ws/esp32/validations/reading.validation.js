const Joi = require('joi')

//

const createReadingSchema = Joi.object({
    icon: Joi.string().required(),
    name: Joi.string().required(),
    unit: Joi.string().required(),
    value: Joi.number().required(),
    outputId: Joi.number().integer().required(),
    greenhouseId: Joi.number().integer().required(),
})

//

module.exports = { createReadingSchema }