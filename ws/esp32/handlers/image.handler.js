const { Image } = require("../../../models/index.model")
// const { createImageDetection } = require("../../../services/detection.service")
const { saveBase64Img } = require("../../../utils/base64-img.util")
const { WebSocketClient } = require("../../wsclient.ws")

//

/**
 * Inserts a new record.
 *
 * @param {WebSocketClient} wsClient The web socket instance of esp32.
 * @param {Array} data The readings sent by esp32.
 */
const onCreateImage = async (wsClient, data) => {
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
