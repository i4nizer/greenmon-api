const { logger } = require('../../utils/logger.util')
const { Camera } = require('../../models/index.model')
const { WebSocketClient } = require('../wsclient.ws')

//

/**
 * @param {WebSocketClient} wsClient This is the uninitialized web socket client.
 */
const sendWsEsp32CamInitialData = async (wsClient) => {
	const { userId, greenhouseId } = wsClient.payload

	// benchmarking
	const ms = Date.now()

	// find all cameras
    const camera = await Camera.findOne({ where: { greenhouseId } })
    wsClient.send("camera", [camera.dataValues], "Create", true)
	
	// benchmark
	const diff = Date.now() - ms
	logger.info(`Web socket initialized with an execution time of ${diff} ms.`)
}

//

module.exports = {
    sendWsEsp32CamInitialData,
}