const path = require("path")
const { mlLettuceModelPredict } = require("../utils/model.util")
const { Log, Alert, Detection, Greenhouse } = require("../models/index.model")

//

/**
 * This performs lettuce NPK detection on the given image.
 * This also creates an alert if the detection founds NPK deficiency.
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
	const logs = []
	const alerts = []
	const detections = []

	const greenhouse = await Greenhouse.findByPk(image.greenhouseId, { attributes: ["userId"] })

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

		if (label == "Healthy") {
			const log = Log.create({
				title: "NPK Detection",
				message: `Healthy lettuce detected on ${image.filename}.`,
				greenhouseId: image.greenhouseId,
			})

			logs.push(log)
		} else {
			const alert = Alert.create({
				title: "NPK Detection",
				message: `${label} lettuce detected on ${image.filename}.`,
				severity: "Warning",
				viewed: false,
				emailed: false,
				greenhouseId: image.greenhouseId,
				userId: greenhouse.userId,
			})

			alerts.push(alert)
		}
	}

	return {
		bboxes,
		logs: await Promise.all(logs),
		alerts: await Promise.all(alerts),
		detections: await Promise.all(detections),
	}
}

//

module.exports = {
	createImageDetection,
}
