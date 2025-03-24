const Sensor = require('../models/sensor.model')
const MCU = require('../models/mcu.model')
const { AppError } = require('../utils/app-error.util')



/** Responds with an array of sensors. */
const getSensor = async (req, res, next) => {
    try {
        const { sensorId } = req.query

        const filter = {
            ...(sensorId && { id: sensorId }),
        }

        const sensorDocs = await Sensor.findAll({ where: filter })

        res.json({ sensors: sensorDocs })
    } catch (error) {
        next(error)
    }
}

/** Responds with create success. */
const postSensor = async (req, res, next) => {
    try {
        const { name, label, mcuId } = req.body

        const mcuDoc = await MCU.findByPk(mcuId)
        if (!mcuDoc) throw new AppError(404, "MCU not found.")

        const sensorDoc = await Sensor.create({ name, label, mcuId })

        res.json({
            text: "Sensor created successfully.",
            sensor: sensorDoc,
        })
    } catch (error) {
        next(error)
    }
}

/** Responds with update success. */
const patchSensor = async (req, res, next) => {
    try {
        const { sensorId, name, label } = req.body
        const filter = { id: sensorId }

        const [updatedRows] = await Sensor.update(
            { name, label },
            { where: filter }
        )

        if (!updatedRows) throw new AppError(404, "Sensor not found.")

        res.json({ text: "Sensor updated successfully." })
    } catch (error) {
        next(error)
    }
}

/** Responds with delete success. */
const deleteSensor = async (req, res, next) => {
    try {
        const { sensorId } = req.query

        const deletedRows = await Sensor.destroy(
            { where: { id: sensorId } }
        )

        if (!deletedRows) throw new AppError(404, "Sensor not found.")

        res.json({ text: "Sensor deleted successfully." })
    } catch (error) {
        next(error)
    }
}



module.exports = {
    getSensor,
    postSensor,
    patchSensor,
    deleteSensor,
}