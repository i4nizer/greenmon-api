const Pin = require('../models/pin.model')
const MCU = require('../models/mcu.model')
const { AppError } = require('../utils/app-error.util')



/** Responds with an array of pins. */
const getPin = async (req, res, next) => {
    try {
        const { mcuId, pinId } = req.query

        const filter = {
            ...(pinId && { id: pinId }),
            ...(mcuId && { mcuId }),
        }

        const pinDocs = await Pin.findAll({ where: filter })

        res.json({ pins: pinDocs })
    } catch (error) {
        next(error)
    }
}

/** Responds with create success. */
const postPin = async (req, res, next) => {
    try {
        const { type, mode, number, mcuId } = req.body

        const mcuDoc = await MCU.findByPk(mcuId)
        if (!mcuDoc) return next(new AppError(404, "MCU not found."))

        const pinDoc = await Pin.create({ type, mode, number, mcuId })

        res.json({
            text: "Pin created successfully.",
            pin: pinDoc,
        })
    } catch (error) {
        next(error)
    }
}

/** Responds with update success. */
const patchPin = async (req, res, next) => {
    try {
        const { pinId, type, mode, number } = req.body

        const pinDoc = await Pin.findByPk(pinId)
		if (!pinDoc) return next(new AppError(404, "Pin not found."))

		await pinDoc.update({ type, mode, number })

        res.json({ text: "Pin updated successfully." })
    } catch (error) {
        next(error)
    }
}

/** Responds with delete success. */
const deletePin = async (req, res, next) => {
    try {
        const { pinId } = req.query

        const pinDoc = await Pin.findByPk(pinId)
        if (!pinDoc) return next(new AppError(404, "Pin not found."))

        await pinDoc.destroy()

        res.json({ text: "Pin deleted successfully." })
    } catch (error) {
        next(error)
    }
}



module.exports = {
    getPin,
    postPin,
    patchPin,
    deletePin,
}