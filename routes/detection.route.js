const express = require("express")
const router = express.Router()

const { getDetectionSchema } = require("../validations/detection.validation")

const { checkJoi } = require("../middlewares/joi.middleware")

const { getDetection, getDetectionCsv, getDetectionCount } = require("../controllers/detection.controller")

//

router.get("/", checkJoi(getDetectionSchema, "query"), getDetection)
router.get("/csv", checkJoi(getDetectionSchema, "query"), getDetectionCsv)
router.get("/count", checkJoi(getDetectionSchema, "query"), getDetectionCount)

//

module.exports = router
