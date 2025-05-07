const Pin = require('../models/pin.model');
const Input = require('../models/input.model');
const { AppError } = require('../utils/app-error.util');

//

/** Responds with an array of inputs. */
const getInput = async (req, res, next) => {
    try {
        const { inputId, pinId, actuatorId } = req.query;
        if (!inputId && !pinId && !actuatorId) return next(new AppError(400, "No id provided."));

        const filter = {
            ...(inputId && { id: inputId }),
            ...(pinId && { pinId }),
            ...(actuatorId && { actuatorId }),
        };

        const inputDocs = await Input.findAll({ where: filter });

        res.json({ inputs: inputDocs });
    } catch (error) {
        next(error);
    }
};

/** Responds with create success. */
const postInput = async (req, res, next) => {
    try {
        const { icon, name, type, flag, status, pinId, actuatorId } = req.body;

        const pinDoc = await Pin.findByPk(pinId);
        
        // Find & Check if the pin mode is not 'Unset'
        if (!pinDoc) return next(new AppError(404, "Pin not found."));
        if (!(pinDoc.mode == "Unset" || pinDoc.mode == "Input")) return next(new AppError(400, "Pin is already in use."));
        
        // Update pin mode to "Input"
        await pinDoc.update({ mode: "Input" }, { source: "client" });

        const inputDoc = await Input.create({
            icon, 
            name, 
            type, 
            flag, 
            status, 
            pinId, 
            actuatorId,
        }, {
            source: "client",
        });

        res.json({
            text: "Input created successfully.",
            input: inputDoc,
        });
    } catch (error) {
        next(error);
    }
};

/** Responds with update success. */
const patchInput = async (req, res, next) => {
    try {
        const { inputId, icon, name, type, flag, status, pinId } = req.body;

        // Find input
        const inputDoc = await Input.findByPk(inputId);
        if (!inputDoc) return next(new AppError(404, "Input not found."));

        // When the pinId is changed
        // Change the mode of the old pin to "Unset"
        if (inputDoc.pinId != pinId) {
            const oldPinDoc = await Pin.findByPk(inputDoc.pinId);
            
            if (oldPinDoc) {
                
                // Check if there are no inputs using the old pin
                const inputCount = await Input.count({ where: { pinId: inputDoc.pinId } });
                if (inputCount <= 1) await oldPinDoc.update({ mode: "Unset" }, { source: "client" });
            }
        }

        // Find the pin
        const pinDoc = await Pin.findByPk(pinId);
        if (!pinDoc) return next(new AppError(404, "Pin not found."));
        if (!(pinDoc.mode == "Unset" || pinDoc.mode == "Input")) return next(new AppError(400, "Pin is already in use."));

        // Update pin mode to "Input"
        await pinDoc.update({ mode: "Input" }, { source: "client" });

        // Finally update input
        await inputDoc.update({
            icon, 
            name, 
            type, 
            flag, 
            status, 
            pinId,
        }, {
            source: "client",
        })

        res.json({ text: "Input updated successfully." });
    } catch (error) {
        next(error);
    }
};

/** Responds with delete success. */
const deleteInput = async (req, res, next) => {
    try {
        const { inputId } = req.query;

        // Find input
        const inputDoc = await Input.findByPk(inputId);
        if (!inputDoc) return next(new AppError(404, "Input not found."));

        // Update pin mode to "Unset"
        const pinDoc = await Pin.findByPk(inputDoc.pinId);
        if (pinDoc) await pinDoc.update({ mode: "Unset" }, { source: "client" });

        await inputDoc.destroy()

        res.json({ text: "Input deleted successfully." });
    } catch (error) {
        next(error);
    }
};

//

module.exports = {
    getInput,
    postInput,
    patchInput,
    deleteInput,
};