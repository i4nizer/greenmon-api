const express = require("express")
const router = express.Router()

const { getDetectionSchema } = require("../validations/detection.validation")

const { checkJoi } = require("../middlewares/joi.middleware")

const { getDetection } = require("../controllers/detection.controller")

//

router
    .route("/")
    .get(checkJoi(getDetectionSchema, "query"), getDetection)

//

module.exports = router
