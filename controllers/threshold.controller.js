const Threshold = require('../models/threshold.model')
const Greenhouse = require('../models/greenhouse.model')
const { AppError } = require('../utils/app-error.util')



/** Responds with an array of thresholds. */
const getThreshold = async (req, res, next) => {
    try {
        const { greenhouseId, thresholdId } = req.query

        const filter = {
            ...(greenhouseId && { greenhouseId }),
            ...(thresholdId && { id: thresholdId }),
        }

        const thresholdDocs = await Threshold.findAll({ where: filter })

        res.json({ thresholds: thresholdDocs })
    } catch (error) {
        next(error)
    }
}

/** Responds with create success. */
const postThreshold = async (req, res, next) => {
    try {
        const { name, operator, disabled, greenhouseId } = req.body

        const greenhouseDoc = await Greenhouse.findByPk(greenhouseId)
        if (!greenhouseDoc) return next(new AppError(404, "Greenhouse not found."))

        const thresholdDoc = await Threshold.create({ name, operator, disabled, greenhouseId })

        res.json({
            text: "Threshold created successfully.",
            threshold: thresholdDoc,
        })
    } catch (error) {
        next(error)
    }
}

/** Responds with update success. */
const patchThreshold = async (req, res, next) => {
    try {
        const { thresholdId, name, operator, disabled } = req.body

        const thresholdDoc = await Threshold.findByPk(thresholdId)
		if (!thresholdDoc) return next(new AppError(404, "Threshold not found."))

		await thresholdDoc.update({ name, operator, disabled })

        res.json({ text: "Threshold updated successfully." })
    } catch (error) {
        next(error)
    }
}

/** Responds with delete success. */
const deleteThreshold = async (req, res, next) => {
    try {
        const { thresholdId } = req.query

        const thresholdDoc = await Threshold.findByPk(thresholdId)
        if (!thresholdDoc) return next(new AppError(404, "Threshold not found."))

        await thresholdDoc.destroy()

        res.json({ text: "Threshold deleted successfully." })
    } catch (error) {
        next(error)
    }
}



module.exports = {
    getThreshold,
    postThreshold,
    patchThreshold,
    deleteThreshold,
}