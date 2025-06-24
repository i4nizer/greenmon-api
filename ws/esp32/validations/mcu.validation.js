const Joi = require('joi')

//

const updateMcuSchema = Joi.object({
    id: Joi.number().integer().required(),
    connected: Joi.boolean().required()
})

//

module.exports = { updateMcuSchema }