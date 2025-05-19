const express = require("express")
const router = express.Router()

const { getImageSchema } = require("../validations/image.validation")

const { checkJoi } = require("../middlewares/joi.middleware")

const { getImage } = require("../controllers/image.controller")

const detectionRoutes = require("./detection.route")

//

router
    .route("/")
    .get(checkJoi(getImageSchema, "query"), getImage)

router.use("/detection", detectionRoutes)

//

module.exports = router
