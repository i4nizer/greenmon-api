const express = require("express")
const router = express.Router()

const { postCameraSchema, patchCameraSchema, deleteCameraSchema, getCameraSchema } = require("../validations/camera.validation")
const { checkJoi } = require("../middlewares/joi.middleware")
const { getCamera, postCamera, patchCamera, deleteCamera } = require("../controllers/camera.controller")

//

router
	.route("/")
	.get(checkJoi(getCameraSchema, 'query'), getCamera)
	.post(checkJoi(postCameraSchema), postCamera)
	.patch(checkJoi(patchCameraSchema), patchCamera)
	.delete(checkJoi(deleteCameraSchema, "query"), deleteCamera)

//

module.exports = router
