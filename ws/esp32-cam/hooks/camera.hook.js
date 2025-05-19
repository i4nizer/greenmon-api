const { logger } = require("../../../utils/logger.util")
const { getWsEsp32Cam } = require("../util.ws")

//

/**
 * Updates the wsClient.payload.realtime
 */
const onAfterUpdateCamera = async (camera, options) => {
    try {
        const wsClients = getWsEsp32Cam(camera.key)
        wsClients.forEach(ws => {
            ws.send('camera', [camera], 'Update')
            ws.payload.detect = camera.detect
            ws.payload.realtime = camera.realtime
        })
        
    } catch (error) {
        logger.error(error, error)
    }
}

//

module.exports = {
    onAfterUpdateCamera,
}