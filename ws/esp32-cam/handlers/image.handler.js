const fs = require('fs/promises')
const path = require('path')
const { Image } = require("../../../models/index.model")
const { WebSocketClient } = require("../../wsclient.ws")
const { sendWsClient } = require('../../client/util.ws')
const { createImageDetection } = require('../../../services/detection.service')

//

/**
 * Creates image record and saves the file for detection.
 *
 * @param {WebSocketClient} wsClient The web socket instance of esp32-cam.
 * @param {Buffer} data The image buffer sent by esp32-cam.
 */
const onCreateImage = async (wsClient, data) => {
    // get meta
    const { userId, cameraId, greenhouseId } = wsClient.payload

    // randomize filename
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${Math.round(Math.random() * 1e9)}`
    const filepath = path.resolve(__dirname, `../../../images/uploads/${filename}.jpg`)

    // save file to disk
    await fs.writeFile(filepath, data)

    // save the image tuple
    const imageDoc = await Image.create(
        { filename, cameraId, greenhouseId, updatedAt: null }, 
        { hooks: true, source: 'esp32-cam', }
    )
    sendWsClient('image', [imageDoc], 'Create')

    // detect if set
    if (wsClient.payload?.detect) {
        const { bboxes, detections } = await createImageDetection(imageDoc)
        sendWsClient(userId, 'detection', detections, 'Create')
    }
}

/**
 * Does not really create image, just broadcasts it to the ws client.
 *
 * @param {WebSocketClient} wsClient The web socket instance of esp32-cam.
 * @param {Buffer} data The image buffer sent by esp32-cam.
 */
const onCreateImageRealtime = async (wsClient, data) => {
    // get meta
    const { userId, cameraId, greenhouseId } = wsClient.payload
    
    // convert to base64 before sending
    const base64img = Buffer.from(data).toString('base64')
    const payload = [{ base64img, cameraId, greenhouseId }]

    sendWsClient(userId, "image-realtime", payload, "Create")
}

//

module.exports = {
    onCreateImage,
    onCreateImageRealtime,
}
