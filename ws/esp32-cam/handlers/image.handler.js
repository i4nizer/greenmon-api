const fs = require('fs/promises')
const path = require('path')
const { Image } = require("../../../models/index.model")
const { WebSocketClient } = require("../../wsclient.ws")
const { sendWsClient } = require('../../client/util.ws')

//

/**
 * Creates image record and saves the file for detection.
 *
 * @param {WebSocketClient} wsClient The web socket instance of esp32-cam.
 * @param {Array} data The inputs sent by esp32-cam.
 */
const onCreateImage = async (wsClient, data) => {
    for (const d of data) {
        
        if (d?.base64img == null) return;
        
        // init path
        const filedir = path.resolve(__dirname, "../../../images/uploads")
        const filepath = `${filedir}/${d?.filename}`
        
        // convert into base64->jpeg
        const base64img = Buffer.from(d?.base64img, "base64")
        const base64str = base64img.toString()

        // save the file
        await fs.writeFile(filepath, base64str)

        // save the image tuple
        await Image.create(d, { source: 'esp32-cam' })
    }
}

/**
 * Does not really create image, just broadcasts it to the ws client.
 *
 * @param {WebSocketClient} wsClient The web socket instance of esp32-cam.
 * @param {Array} data The inputs sent by esp32-cam.
 */
const onCreateImageRealtime = async (wsClient, data) => {
    const { userId } = wsClient.payload
    
    for (const d of data) {

        if (d?.base64img == null) return;

        // d = { base64img, cameraId, greenhouseId }
        sendWsClient(userId, "image-realtime", d, "Create")
    }
}

//

module.exports = {
    onCreateImage,
    onCreateImageRealtime,
}
