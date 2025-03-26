const Pin = require('../models/pin.model')
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

        // Update pin mode to "Output"
        const pinDoc = await Pin.findByPk(pinId)
        if (!pinDoc) return next(new AppError(404, "Pin not found."))
        if (!(pinDoc.mode == 'Unset' || pinDoc.mode == 'Output')) return next(new AppError(400, "Pin is already in use."))
        
        await pinDoc.update({ mode: "Output" })

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
        const { outputId, icon, name, unit, type, pinId } = req.body
        const filter = { id: outputId }

        // find the output
        const outputDoc = await Output.findByPk(outputId)
        if (!outputDoc) return next(new AppError(404, "Output not found."))
        
        // when pinId is changed,
        // change the mode of the old pin to "Unset"
        if (outputDoc.pinId != pinId) {
            const oldPinDoc = await Pin.findByPk(outputDoc.pinId)
            
            if (oldPinDoc) {
                
                // check if there are no outputs using the old pin
                const outputCount = await Output.count({ where: { pinId: oldPinDoc.id } })
                if (outputCount <= 1) await oldPinDoc.update({ mode: "Unset" })
            }
        }
    
        // Find the pin
        const pinDoc = await Pin.findByPk(pinId)
        if (!pinDoc) return next(new AppError(404, "Pin not found."))
        if (!(pinDoc.mode == 'Unset' || pinDoc.mode == 'Output')) return next(new AppError(400, "Pin is already in use."))
            
        // Update pin mode to "Output"
        await pinDoc.update({ mode: "Output" })

        const [updatedRows] = await Output.update(
            { icon, name, unit, type, pinId },
            { where: filter }
        )

        if (!updatedRows) return next(new AppError(404, "Output not found."))

        res.json({ text: "Output updated successfully." })
    } catch (error) {
        next(error)
    }
}

/** Responds with delete success. */
const deleteOutput = async (req, res, next) => {
    try {
        const { outputId } = req.query

        // Find output
        const outputDoc = await Output.findByPk(outputId)
        if (!outputDoc) return next(new AppError(404, "Output not found."))
            
        // Update pin mode to "Unset"
        const pinDoc = await Pin.findByPk(outputDoc.pinId)
        if (pinDoc) await pinDoc.update({ mode: "Unset" })

        const deletedRows = await Output.destroy(
            { where: { id: outputId } }
        )

        if (!deletedRows) return next(new AppError(404, "Output not found."))

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