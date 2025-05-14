const Joi = require("joi")

/** Requires greenhouseId and optionally scheduleId. */
const getScheduleSchema = Joi.object({
    greenhouseId: Joi.number().integer().optional(),
    scheduleId: Joi.number().integer().optional(),
})

/** Requires days, times, and greenhouseId. */
const postScheduleSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    days: Joi.array().items(Joi.number().integer().min(0).max(6)).required(),
    times: Joi.array().items(Joi.string()).required(),
    greenhouseId: Joi.number().integer().required(),
})

/** Requires scheduleId and optionally days and times. */
const patchScheduleSchema = Joi.object({
    id: Joi.number().integer().optional(),
	scheduleId: Joi.number().integer().required(),
	name: Joi.string().min(3).max(100).optional(),
	days: Joi.array().items(Joi.number().integer().min(0).max(6)).optional(),
	times: Joi.array().items(Joi.string()).optional(),
})

/** Requires scheduleId. */
const deleteScheduleSchema = Joi.object({
    scheduleId: Joi.number().integer().required(),
})

module.exports = {
    getScheduleSchema,
    postScheduleSchema,
    patchScheduleSchema,
    deleteScheduleSchema,
}