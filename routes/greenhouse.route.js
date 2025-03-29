const express = require("express")
const router = express.Router()

const {
    postGreenhouseSchema,
    patchGreenhouseSchema,
} = require("../validations/greenhouse.validation")

const { checkJoi } = require("../middlewares/joi.middleware")

const {
    getGreenhouse,
    postGreenhouse,
    patchGreenhouse,
    deleteGreenhouse
} = require("../controllers/greenhouse.controller")

const mcuRoutes = require("./mcu.route")
const actionRoutes = require("./action.route")
const scheduleRoutes = require("./schedule.route")
const thresholdRoutes = require("./threshold.route")
    
    

router.route("/")
    .get(getGreenhouse)
    .post(checkJoi(postGreenhouseSchema), postGreenhouse)
    .patch(checkJoi(patchGreenhouseSchema), patchGreenhouse)
    .delete(deleteGreenhouse)

router.use("/mcu", mcuRoutes)
router.use("/action", actionRoutes)
router.use("/schedule", scheduleRoutes)
router.use("/threshold", thresholdRoutes)



module.exports = router