const cloudinary = require("../../../configs/cloudinary.config")
const { Readable } = require("stream")
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
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${Math.round(Math.random() * 1e9)}.jpeg`
    
    // cloudinary stream
    const stream = cloudinary.uploader.upload_stream(filename, {
        type: "authenticated",
        folder: "upload",
        public_id: filename,
        resource_type: "image"
    })

    // stream image to cloudinary
    Readable.from(data).pipe(stream)

    // save the image tuple
    const imageDoc = await Image.create(
        { filename, cameraId, greenhouseId, }, 
        { hooks: true, source: 'esp32-cam', }
    )
    sendWsClient('image', [imageDoc], 'Create')

    // detect if set
    if (wsClient.payload?.detect) {
        const { bboxes, logs, alerts, detections } = await createImageDetection(imageDoc)
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
