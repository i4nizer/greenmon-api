const { Image } = require("../../../models/index.model")
// const { createImageDetection } = require("../../../services/detection.service")
const { saveBase64Img } = require("../../../utils/base64-img.util")
const { sendWsEsp32 } = require("../util.ws")

//

/**
 * Inserts a new record.
 * 
 * @param {WebSocket} ws The web socket of esp32.
 * @param {Array} data The readings sent by esp32.
 */
const onCreateImage = async (ws, data) => {
    for (const d of data) {
        d.name = `${d?.name}-${new Date().toISOString()}`
        d.path = await saveBase64Img(d?.value, "../../../images/uploads", d.name)
        const image = await Image.create(d, { individualHooks: true, source: "esp32" })

        // detect if the image has lettuce
        // await createImageDetection(image)
    }
}

//

module.exports = {
    onCreateImage,
}