const { logger } = require('../../../utils/logger.util')
const { sendWsClient, getWsClient } = require('../util.ws')
const { Greenhouse } = require('../../../models/index.model')



/**
 * Sends created log to client.
 */
const onAfterLogCreate = async (log, options) => {
    try {
        const greenhouse = await Greenhouse.findByPk(log.greenhouseId, { attributes: ['userId'] })
        const ws = getWsClient(greenhouse.userId)
        
		if (!ws) return;
		sendWsClient(ws, 'log', log, 'Create')

	} catch (error) {
		logger.error(error.message, error)
	}
}



module.exports = {
	onAfterLogCreate,
}