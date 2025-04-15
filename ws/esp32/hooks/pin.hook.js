const { logger } = require('../../../utils/logger.util')
const { sendWsEsp32, getWsEsp32 } = require('../util.ws')
const { Greenhouse, MCU, Output, Input, Condition } = require('../../../models/index.model')



const onAfterPinBulkCreate = async (pins, options) => {
    try {
        const mcu = await MCU.findByPk(pins?.at(0)?.mcuId)
        const greenhouse = await Greenhouse.findByPk(mcu.greenhouseId)
        const ws = getWsEsp32(greenhouse.key)

        if (!ws) return;
        sendWsEsp32(ws, 'pin', pins, 'Create')

    } catch (error) {
        logger.error(error.message, error)
    }
}

/**
 * Sends created pin to esp32.
 */
const onAfterPinCreate = async (pin, options) => {
    try {
        const mcu = await MCU.findByPk(pin.mcuId)
        const greenhouse = await Greenhouse.findByPk(mcu.greenhouseId)
        const ws = getWsEsp32(greenhouse.key)
        
        if (!ws) return;
        sendWsEsp32(ws, 'pin', pin, 'Create')

    } catch (error) {
        logger.error(error.message, error)
    }
}

/**
 * Sends updated pin to esp32.
 */
const onAfterPinUpdate = async (pin, options) => {
    try {
        const mcu = await MCU.findByPk(pin.mcuId)
		const greenhouse = await Greenhouse.findByPk(mcu.greenhouseId)
        const ws = getWsEsp32(greenhouse.key)
        
        if (!ws) return;
        sendWsEsp32(ws, 'pin', pin, 'Update')

    } catch (error) {
        logger.error(error.message, error)
    }
}

/**
 * Sends pin cascade delete to esp32.
 */
const onBeforePinDelete = async (pin, options) => {
    try {
        const mcu = await MCU.findByPk(pin.mcuId)
		const greenhouse = await Greenhouse.findByPk(mcu.greenhouseId)
        const ws = getWsEsp32(greenhouse.key)
        if (!ws) return;

        // delete pin
        sendWsEsp32(ws, 'pin', pin, 'Delete')
        
        // delete pin inputs
        const inputs = await Input.findAll({ where: { pinId: pin.id } })
        sendWsEsp32(ws, 'input', [{ pinId: pin.id }], 'Delete')

        // delete pin inputs actions
        const actions = await Input.findAll({ where: { inputId: inputs.map(i => i.id) } })
        sendWsEsp32(ws, 'action', inputs.map(i => ({ inputId: i.id })), 'Delete')

        // delete pin outputs
        const outputs = await Output.findAll({ where: { pinId: pin.id } })
        sendWsEsp32(ws, "output", [{ pinId: pin.id }], "Delete")

        // delete pin outputs conditions
        sendWsEsp32(ws, 'condition', outputs.map(o => ({ outputId: o.id })), 'Delete')

    } catch (error) {
        logger.error(error.message, error)
    }
}



module.exports = {
    onAfterPinBulkCreate,
    onAfterPinCreate,
    onAfterPinUpdate,
    onBeforePinDelete,
}