const express = require("express")
const router = express.Router()

const { getPinSchema, postPinSchema, patchPinSchema, deletePinSchema } = require("../validations/pin.validation")

const { checkJoi } = require("../middlewares/joi.middleware")

const { getPin, postPin, patchPin, deletePin } = require("../controllers/pin.controller")

//

router
	.route("/")
	.get(checkJoi(getPinSchema, "query"), getPin)
	.post(checkJoi(postPinSchema), postPin)
	.patch(checkJoi(patchPinSchema), patchPin)
	.delete(checkJoi(deletePinSchema, "query"), deletePin)

//

module.exports = router
