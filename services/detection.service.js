const path = require("path")
const { mlLettuceModelPredict } = require("../utils/model.util")
const { Detection } = require("../models/index.model")

//

/**
 * This performs lettuce NPK detection on the given image.
 *
 * @param {{
 *  id: number,
 *  filename: string
 *  cameraId: number
 *  greenhouseId: number
 * }} image The image object created after insertion to database.
 */
const createImageDetection = async (image) => {
    const filepath = path.resolve(__dirname, `../images/uploads/${image.filename}.jpg`)
	const bboxes = await mlLettuceModelPredict(filepath)
	const detections = []

	for (const bbox of bboxes) {
		const { box, class: label, confidence } = bbox
		const { x, y, w, h } = box

		const detection = Detection.create({
			class: label,
			confidence,
			x,
			y,
			w,
			h,
			imageId: image.id,
		})

		detections.push(detection)
	}

	return {
		bboxes,
		detections: await Promise.all(detections),
	}
}

//

module.exports = {
	createImageDetection,
}
