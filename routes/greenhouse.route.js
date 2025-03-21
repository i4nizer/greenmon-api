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
    
    

router.route("/")
    .get(getGreenhouse)
    .post(checkJoi(postGreenhouseSchema), postGreenhouse)
    .patch(checkJoi(patchGreenhouseSchema), patchGreenhouse)
    .delete(deleteGreenhouse)

router.use("/mcu", mcuRoutes)



module.exports = router