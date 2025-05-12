const express = require("express")
const router = express.Router()

const {
	getThresholdSchema,
	postThresholdSchema,
	patchThresholdSchema,
	deleteThresholdSchema,
} = require("../validations/threshold.validation")

const { checkJoi } = require("../middlewares/joi.middleware")

const { getThreshold, postThreshold, patchThreshold, deleteThreshold } = require("../controllers/threshold.controller")

const conditionRoutes = require("./condition.route")

//

router
	.route("/")
	.get(checkJoi(getThresholdSchema, "query"), getThreshold)
	.post(checkJoi(postThresholdSchema), postThreshold)
	.patch(checkJoi(patchThresholdSchema), patchThreshold)
	.delete(checkJoi(deleteThresholdSchema, "query"), deleteThreshold)

router.use("/condition", conditionRoutes)

//

module.exports = router
