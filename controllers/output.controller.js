const Output = require('../models/output.model')
const { AppError } = require('../utils/app-error.util')



/** Responds with an array of outputs. */
const getOutput = async (req, res, next) => {
    try {
        const { outputId, pinId, sensorId } = req.query
        if (!outputId && !pinId && !sensorId) return next(new AppError(400, "No id provided."))

        const filter = {
            ...(outputId && { id: outputId }),
            ...(pinId && { pinId }),
            ...(sensorId && { sensorId }),
        }

        const outputDocs = await Output.findAll({ where: filter })

        res.json({ outputs: outputDocs })
    } catch (error) {
        next(error)
    }
}

/** Responds with create success. */
const postOutput = async (req, res, next) => {
    try {
        const { icon, name, unit, type, pinId, sensorId } = req.body

        const outputDoc = await Output.create({ icon, name, unit, type, pinId, sensorId })

        res.json({
            text: "Output created successfully.",
            output: outputDoc,
        })
    } catch (error) {
        next(error)
    }
}

/** Responds with update success. */
const patchOutput = async (req, res, next) => {
    try {
        const { outputId, icon, name, unit, type } = req.body
        const filter = { id: outputId }

        const [updatedRows] = await Output.update(
            { icon, name, unit, type },
            { where: filter }
        )

        if (!updatedRows) throw new AppError(404, "Output not found.")

        res.json({ text: "Output updated successfully." })
    } catch (error) {
        next(error)
    }
}

/** Responds with delete success. */
const deleteOutput = async (req, res, next) => {
    try {
        const { outputId } = req.query

        const deletedRows = await Output.destroy(
            { where: { id: outputId } }
        )

        if (!deletedRows) throw new AppError(404, "Output not found.")

        res.json({ text: "Output deleted successfully." })
    } catch (error) {
        next(error)
    }
}



module.exports = {
    getOutput,
    postOutput,
    patchOutput,
    deleteOutput,
}