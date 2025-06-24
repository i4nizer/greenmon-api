const { logger } = require("../utils/logger.util");
const { Log, MCU, Camera, Sensor, Actuator } = require('../models/index.model')

//

/** Creates log upon creation of mcu. */
const onAfterMcuCreate = async (mcu, options) => {
    
    await Log.create({
		title: "Microcontroller Added",
		message: `Microcontroller "${mcu?.name}" created successfully.`,
		greenhouseId: mcu?.greenhouseId,
	}).catch((err) => logger.error(err?.message, err))
}

/** Creates log upon deletion of mcu. */
const onAfterMcuDelete = async (mcu, options) => {
    
    await Log.create({
        title: "Microcontroller Removed",
        message: `Microcontroller "${mcu?.name}" deleted successfully.`,
        greenhouseId: mcu?.greenhouseId
    }).catch(err => logger.error(err?.message, err))
}

/** Creates log upon creation of camera. */
const onAfterCameraCreate = async (camera, options) => {

    await Log.create({
        title: "Camera Added",
        message: `Microcontroller "${camera?.name}" created successfully.`,
        greenhouseId: camera?.greenhouseId
    }).catch(err => logger.error(err?.message, err))
}

/** Creates log upon deletion of camera. */
const onAfterCameraDelete = async (camera, options) => {
    
    await Log.create({
		title: "Camera Removed",
		message: `Microcontroller "${camera?.name}" deleted successfully.`,
		greenhouseId: camera?.greenhouseId
	}).catch((err) => logger.error(err?.message, err))
}

/** Creates log upon creation of sensor. */
const onAfterSensorCreate = async (sensor, options) => {
    
    const mcu = await MCU.findOne({ where: { id: sensor?.mcuId }, attributes: ['greenhouseId'] })

    await Log.create({
        title: "Sensor Added",
        message: `Sensor "${sensor?.name}" created successfully.`,
        greenhouseId: mcu?.greenhouseId
    }).catch(err => logger.error(err?.message, err))
}

/** Creates log upon deletion of sensor. */
const onAfterSensorDelete = async (sensor, options) => {
    
    const mcu = await MCU.findOne({ where: { id: sensor?.mcuId }, attributes: ["greenhouseId"] })

    await Log.create({
		title: "Sensor Removed",
		message: `Sensor "${sensor?.name}" deleted successfully.`,
		greenhouseId: mcu?.greenhouseId,
	}).catch((err) => logger.error(err?.message, err))
}

/** Creates log upon creation of actuator. */
const onAfterActuatorCreate = async (actuator, options) => {
    
    const mcu = await MCU.findOne({ where: { id: actuator?.mcuId }, attributes: ["greenhouseId"] })

    await Log.create({
        title: "Actuator Added",
        message: `Actuator "${actuator?.name}" created successfully.`,
        greenhouseId: mcu?.greenhouseId
    }).catch(err => logger.error(err?.message, err))
}

/** Creates log upon deletion of actuator. */
const onAfterActuatorDelete = async (actuator, options) => {

    const mcu = await MCU.findOne({ where: { id: actuator?.mcuId }, attributes: ["greenhouseId"] })

    await Log.create({
		title: "Actuator Removed",
		message: `Actuator "${actuator?.name}" deleted successfully.`,
		greenhouseId: mcu?.greenhouseId,
	}).catch((err) => logger.error(err?.message, err))
}

/** Binds hooks about creation and deletion of devices of a greenhouse. */
const notifInitLog = async () => {
    MCU.afterCreate(onAfterMcuCreate);
    MCU.afterDestroy(onAfterMcuDelete);
    
    Camera.afterCreate(onAfterCameraCreate);
    Camera.afterDestroy(onAfterCameraDelete);
    
    Sensor.afterCreate(onAfterSensorCreate);
    Sensor.afterDestroy(onAfterSensorDelete);
    
    Actuator.afterCreate(onAfterActuatorCreate);
    Actuator.afterDestroy(onAfterActuatorDelete);
}

//

module.exports = { notifInitLog }