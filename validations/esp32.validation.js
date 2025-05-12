const Joi = require("joi")

//

/** Requires type, value, outputId, and thresholdId. */
const postImageEsp32Schema = Joi.object({
    icon: Joi.string().required(),
    name: Joi.string().required(),
    unit: Joi.string().required(),
    outputId: Joi.number().integer().required(),
})

//

module.exports = {
    postImageEsp32Schema,
}