const Joi = require('joi')

//

const updateConditionSchema = Joi.object({
    id: Joi.number().integer().required(),
    satisfied: Joi.boolean().required(),
})

//

module.exports = { updateConditionSchema }