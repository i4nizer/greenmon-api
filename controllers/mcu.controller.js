const MCU = require('../models/mcu.model')
const Pin = require('../models/pin.model')
const Greenhouse = require('../models/greenhouse.model')
const { AppError } = require('../utils/app-error.util')
const { createToken } = require('../services/token.service')
const env = require('../configs/env.config')



/** Responds with an array of mcus. */
const getMcu = async (req, res, next) => {
    try {
        const { userId } = req.accessTokenPayload
        const { mcuId, greenhouseId } = req.query
        
        const filter = {
            ...(mcuId && { id: mcuId }),
            ...(greenhouseId && { greenhouseId }),
        }

        const include =
            !mcuId && !greenhouseId
                ? {
                    model: Greenhouse,
                    where: { userId },
                    attributes: [],
                }
                : undefined;

        const mcuDocs = await MCU.findAll({ where: filter, include })

        res.json({ mcus: mcuDocs })
    } catch (error) {
        next(error)
    }
}

/** Responds with create success. */
const postMcu = async (req, res, next) => {
    try {
        const { userId } = req.accessTokenPayload
        const { name, label, pins, greenhouseId } = req.body

        const mcuDoc = await MCU.create({ name, label, key: "Temporary Key", greenhouseId })
        const { tokenStr: key } = await createToken(userId, { greenhouseId }, "Api", env.apiLife)
        await mcuDoc.update({ key })

        pins.forEach(p => p.mcuId = mcuDoc.id)
        const pinDocs = await Pin.bulkCreate(pins, { validate: true })

        res.json({
            text: "MCU created successfully.",
            mcu: mcuDoc,
            pins: pinDocs,
        })
    } catch (error) {
        next(error)
    }
}

/** Responds with update success. */
const patchMcu = async (req, res, next) => {
    try {
        const { mcuId, name, label } = req.body
        const filter = { id: mcuId }

        const [updatedRows] = await MCU.update(
            { name, label },
            { where: filter }
        )

        if (!updatedRows) return next(new AppError(404, "MCU not found."))

        res.json({ text: "MCU updated successfully." })
    } catch (error) {
        next(error)
    }
}

/** Responds with delete success. */
const deleteMcu = async (req, res, next) => {
    try {
        const { mcuId } = req.query

        const deletedRows = await MCU.destroy(
            { where: { id: mcuId } }
        )

        if (!deletedRows) return next(new AppError(404, "MCU not found."))

        res.json({ text: "MCU deleted successfully." })
    } catch (error) {
        next(error)
    }
}



module.exports = {
    getMcu,
    postMcu,
    patchMcu,
    deleteMcu,
}