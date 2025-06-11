const express = require("express")
const router = express.Router()

const { getImageSchema, getImageUploadSchema } = require("../validations/image.validation")

const { checkJoi } = require("../middlewares/joi.middleware")

const { getImage, getImageCsv, getImageCount, getImageUpload } = require("../controllers/image.controller")

const detectionRoutes = require("./detection.route")

//

router.get("/", checkJoi(getImageSchema, "query"), getImage)
router.get("/csv", checkJoi(getImageSchema, "query"), getImageCsv)
router.get("/count", checkJoi(getImageSchema, "query"), getImageCount)
router.get("/upload", checkJoi(getImageUploadSchema, "query"), getImageUpload)

router.use("/detection", detectionRoutes)

//

module.exports = router
