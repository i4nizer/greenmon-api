const Sensor = require('../models/sensor.model')
const MCU = require('../models/mcu.model')
const { AppError } = require('../utils/app-error.util')



/** Responds with an array of sensors. */
const getSensor = async (req, res, next) => {
    try {
        const { mcuId, sensorId } = req.query

        const filter = {
            ...(mcuId && { mcuId }),
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
        const { name, label, interval, disabled, mcuId } = req.body

        const mcuDoc = await MCU.findByPk(mcuId)
        if (!mcuDoc) return next(new AppError(404, "MCU not found."))

        const sensorDoc = await Sensor.create({ name, label, interval, disabled, mcuId })

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
        const { sensorId, name, label, interval, disabled } = req.body

        const sensorDoc = await Sensor.findByPk(sensorId)
		if (!sensorDoc) return next(new AppError(404, "Sensor not found."))

		await sensorDoc.update({ name, label, interval, disabled })

        res.json({ text: "Sensor updated successfully." })
    } catch (error) {
        next(error)
    }
}

/** Responds with delete success. */
const deleteSensor = async (req, res, next) => {
    try {
        const { sensorId } = req.query

        const sensorDoc = await Sensor.findByPk(sensorId)
        if (!sensorDoc) return next(new AppError(404, "Sensor not found."))
        
        await sensorDoc.destroy()

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