const express = require("express")
const router = express.Router()
const path = require("path")

const {
    postGreenhouseSchema,
    patchGreenhouseSchema,
} = require("../validations/greenhouse.validation")

const { checkJoi } = require("../middlewares/joi.middleware")
const { checkAccessToken } = require("../middlewares/token.middleware")

const {
    getGreenhouse,
    postGreenhouse,
    patchGreenhouse,
    deleteGreenhouse
} = require("../controllers/greenhouse.controller")

const cameraRoutes = require("./camera.route")
const mcuRoutes = require("./mcu.route")
const actionRoutes = require("./action.route")
const scheduleRoutes = require("./schedule.route")
const thresholdRoutes = require("./threshold.route")
const logRoutes = require("./log.route")
const alertRoutes = require("./alert.route")
const imageRoutes = require("./image.route")
const readingRoutes = require("./reading.route")

//    

router.route("/")
    .get(getGreenhouse)
    .post(checkJoi(postGreenhouseSchema), postGreenhouse)
    .patch(checkJoi(patchGreenhouseSchema), patchGreenhouse)
    .delete(deleteGreenhouse)

router.use("/camera", cameraRoutes)
router.use("/mcu", mcuRoutes)
router.use("/action", actionRoutes)
router.use("/schedule", scheduleRoutes)
router.use("/threshold", thresholdRoutes)
router.use("/log", logRoutes)
router.use("/alert", alertRoutes)
router.use("/image", imageRoutes)
router.use("/reading", readingRoutes)
router.use("/uploads", checkAccessToken, express.static(path.join(__dirname, "../images/uploads")))
    
//

module.exports = router