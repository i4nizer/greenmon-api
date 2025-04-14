const Actuator = require('../models/actuator.model');
const MCU = require('../models/mcu.model');
const { AppError } = require('../utils/app-error.util');



/** Responds with an array of actuators. */
const getActuator = async (req, res, next) => {
    try {
        const { mcuId, actuatorId } = req.query;

        const filter = {
            ...(mcuId && { mcuId }),
            ...(actuatorId && { id: actuatorId }),
        };

        const actuatorDocs = await Actuator.findAll({ where: filter });

        res.json({ actuators: actuatorDocs });
    } catch (error) {
        next(error);
    }
};

/** Responds with create success. */
const postActuator = async (req, res, next) => {
    try {
        const { name, label, mcuId } = req.body;

        const mcuDoc = await MCU.findByPk(mcuId);
        if (!mcuDoc) return next(new AppError(404, "MCU not found."));

        const actuatorDoc = await Actuator.create({ name, label, mcuId });

        res.json({
            text: "Actuator created successfully.",
            actuator: actuatorDoc,
        });
    } catch (error) {
        next(error);
    }
};

/** Responds with update success. */
const patchActuator = async (req, res, next) => {
    try {
        const { actuatorId, name, label } = req.body;
        
        const actuatorDoc = await Actuator.findByPk(actuatorId)
		if (!actuatorDoc) return next(new AppError(404, "Actuator not found."))

		await actuatorDoc.update({ name, label })

        res.json({ text: "Actuator updated successfully." });
    } catch (error) {
        next(error);
    }
};

/** Responds with delete success. */
const deleteActuator = async (req, res, next) => {
    try {
        const { actuatorId } = req.query;

        const actuatorDoc = await Actuator.findByPk(actuatorId)
        if (!actuatorDoc) return next(new AppError(404, "Actuator not found."));

        await actuatorDoc.destroy()

        res.json({ text: "Actuator deleted successfully." });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getActuator,
    postActuator,
    patchActuator,
    deleteActuator,
};