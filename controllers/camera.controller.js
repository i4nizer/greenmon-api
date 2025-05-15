const env = require("../configs/env.config")
const Camera = require("../models/camera.model")
const Greenhouse = require("../models/greenhouse.model")
const { createToken } = require("../services/token.service")
const { AppError } = require("../utils/app-error.util")

//

// Get cameras
const getCamera = async (req, res, next) => {
	try {
		const { userId } = req.accessTokenPayload
		const { cameraId, greenhouseId } = req.query

		const filter = {
			...(cameraId && { id: cameraId }),
			...(greenhouseId && { greenhouseId }),
		}

		const include =
			!cameraId && !greenhouseId
				? {
                    model: Greenhouse,
                    where: { userId },
                    attributes: [],
				  }
				: undefined

		const cameraDocs = await Camera.findAll({ where: filter, include })

		res.json({ cameras: cameraDocs })
	} catch (error) {
		next(error)
	}
}

// Create camera
const postCamera = async (req, res, next) => {
    try {
        const { userId } = req.accessTokenPayload
		const { name, label, detect, interval, disabled, connected, greenhouseId } = req.body

        const { tokenStr: key } = await createToken(userId, { greenhouseId }, "Api", env.apiLife)
        const cameraDoc = await Camera.create({
            key,
			name,
			label,
			detect,
			interval,
			disabled,
			connected,
			greenhouseId,
        })

		res.json({
			text: "Camera created successfully.",
			camera: cameraDoc,
		})
	} catch (error) {
		next(error)
	}
}

// Update camera
const patchCamera = async (req, res, next) => {
	try {
		const { cameraId, name, label, detect, interval, disabled, connected } = req.body

		const cameraDoc = await Camera.findByPk(cameraId)
		if (!cameraDoc) return next(new AppError(404, "Camera not found."))

		await cameraDoc.update({ name, label, detect, interval, disabled, connected }, { source: "client" })

		res.json({ text: "Camera updated successfully." })
	} catch (error) {
		next(error)
	}
}

// Delete camera
const deleteCamera = async (req, res, next) => {
	try {
		const { cameraId } = req.query

		const cameraDoc = await Camera.findByPk(cameraId)
		if (!cameraDoc) return next(new AppError(404, "Camera not found."))

		await cameraDoc.destroy({ source: "client" })

		res.json({ text: "Camera deleted successfully." })
	} catch (error) {
		next(error)
	}
}

//

module.exports = {
	getCamera,
	postCamera,
	patchCamera,
	deleteCamera,
}
