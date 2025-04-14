const Condition = require('../models/condition.model')
const Threshold = require('../models/threshold.model')
const { AppError } = require('../utils/app-error.util')



/** Responds with an array of conditions. */
const getCondition = async (req, res, next) => {
    try {
        const { thresholdId, conditionId } = req.query

        const filter = {
            ...(thresholdId && { thresholdId }),
            ...(conditionId && { id: conditionId }),
        }

        const conditionDocs = await Condition.findAll({ where: filter })

        res.json({ conditions: conditionDocs })
    } catch (error) {
        next(error)
    }
}

/** Responds with create success. */
const postCondition = async (req, res, next) => {
    try {
        const { type, value, outputId, thresholdId } = req.body

        const thresholdDoc = await Threshold.findByPk(thresholdId)
        if (!thresholdDoc) return next(new AppError(404, "Threshold not found."))

        const conditionDoc = await Condition.create({ type, value, outputId, thresholdId })

        res.json({
            text: "Condition created successfully.",
            condition: conditionDoc,
        })
    } catch (error) {
        next(error)
    }
}

/** Responds with update success. */
const patchCondition = async (req, res, next) => {
    try {
        const { conditionId, type, value, outputId } = req.body

        const conditionDoc = await Condition.findByPk(conditionId)
		if (!conditionDoc) return next(new AppError(404, "Condition not found."))

		await conditionDoc.update({ type, value, outputId })

        res.json({ text: "Condition updated successfully." })
    } catch (error) {
        next(error)
    }
}

/** Responds with delete success. */
const deleteCondition = async (req, res, next) => {
    try {
        const { conditionId } = req.query

        const conditionDoc = await Condition.findByPk(conditionId)
        if (!conditionDoc) return next(new AppError(404, "Condition not found."))

        await conditionDoc.destroy()

        res.json({ text: "Condition deleted successfully." })
    } catch (error) {
        next(error)
    }
}



module.exports = {
    getCondition,
    postCondition,
    patchCondition,
    deleteCondition,
}