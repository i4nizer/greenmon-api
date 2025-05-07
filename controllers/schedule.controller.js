const Schedule = require('../models/schedule.model')
const Greenhouse = require('../models/greenhouse.model')
const { AppError } = require('../utils/app-error.util')

//

/** Responds with an array of schedules. */
const getSchedule = async (req, res, next) => {
    try {
        const { greenhouseId, scheduleId } = req.query

        const filter = {
            ...(greenhouseId && { greenhouseId }),
            ...(scheduleId && { id: scheduleId }),
        }

        const scheduleDocs = await Schedule.findAll({ where: filter })

        res.json({ schedules: scheduleDocs })
    } catch (error) {
        next(error)
    }
}

/** Responds with create success. */
const postSchedule = async (req, res, next) => {
    try {
        const { name, days, times, disabled, greenhouseId } = req.body

        const greenhouseDoc = await Greenhouse.findByPk(greenhouseId)
        if (!greenhouseDoc) return next(new AppError(404, "Greenhouse not found."))

        const scheduleDoc = await Schedule.create({
            name, 
            days, 
            times, 
            disabled, 
            greenhouseId,
        }, {
            source: "client",
        })

        res.json({
            text: "Schedule created successfully.",
            schedule: scheduleDoc,
        })
    } catch (error) {
        next(error)
    }
}

/** Responds with update success. */
const patchSchedule = async (req, res, next) => {
    try {
        const { scheduleId, name, days, times, disabled } = req.body

        const scheduleDoc = await Schedule.findByPk(scheduleId)
		if (!scheduleDoc) return next(new AppError(404, "Schedule not found."))

        await scheduleDoc.update({
            name, 
            days, 
            times, 
            disabled,
        }, {
            source: "client",
        })
        
        res.json({ text: "Schedule updated successfully." })
    } catch (error) {
        next(error)
    }
}

/** Responds with delete success. */
const deleteSchedule = async (req, res, next) => {
    try {
        const { scheduleId } = req.query

        const scheduleDoc = await Schedule.findByPk(scheduleId)
        if (!scheduleDoc) return next(new AppError(404, "Schedule not found."))

        await scheduleDoc.destroy({ source: "client" })
        
        res.json({ text: "Schedule deleted successfully." })
    } catch (error) {
        next(error)
    }
}

//

module.exports = {
    getSchedule,
    postSchedule,
    patchSchedule,
    deleteSchedule,
}