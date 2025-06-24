const Joi = require('joi')

//

const updateScheduleSchema = Joi.object({
    id: Joi.number().integer().required(),
    activated: Joi.boolean().required()
})

//

module.exports = { updateScheduleSchema }