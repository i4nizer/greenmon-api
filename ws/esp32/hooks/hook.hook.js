const { logger } = require('../../../utils/logger.util')
const { sendWsEsp32 } = require('../util.ws')
const { Greenhouse, Threshold, Action } = require('../../../models/index.model')

//

/**
 * Sends created hook to esp32.
 */
const onAfterHookCreate = async (hook, options) => {
    try {
        if (options.source === 'esp32') return; // Ignore esp32 source

        const action = await Action.findByPk(hook.actionId, { attributes: ['greenhouseId'] })
        const greenhouse = await Greenhouse.findByPk(action.greenhouseId, { attributes: ['key'] })
        sendWsEsp32(greenhouse.key, 'hook', [hook], 'Create')

    } catch (error) {
        logger.error(error.message, error)
    }
}

/**
 * Sends updated hook to esp32.
 */
const onAfterHookUpdate = async (hook, options) => {
    try {
        if (options.source === 'esp32') return; // Ignore esp32 source

        const action = await Action.findByPk(hook.actionId, { attributes: ["greenhouseId"] })
		const greenhouse = await Greenhouse.findByPk(action.greenhouseId, { attributes: ['key'] })
        sendWsEsp32(greenhouse.key, 'hook', [hook], 'Update')

    } catch (error) {
        logger.error(error.message, error)
    }
}

/**
 * Sends hook cascade delete to esp32.
 */
const onBeforeHookDelete = async (hook, options) => {
    try {
        if (options.source === 'esp32') return; // Ignore esp32 source
        
        const action = await Action.findByPk(hook.actionId, { attributes: ["greenhouseId"] })
		const greenhouse = await Greenhouse.findByPk(action.greenhouseId, { attributes: ["key"] })
        const ws = getWsEsp32(greenhouse.key)
        sendWsEsp32(greenhouse.key, 'hook', [hook], 'Delete')

    } catch (error) {
        logger.error(error.message, error)
    }
}

//

module.exports = {
    onAfterHookCreate,
    onAfterHookUpdate,
    onBeforeHookDelete,
}