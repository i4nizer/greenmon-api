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

router.route("/")
    .get(getGreenhouse)
    .post(checkJoi(postGreenhouseSchema), postGreenhouse)
    .patch(checkJoi(patchGreenhouseSchema), patchGreenhouse)
    .delete(deleteGreenhouse)



module.exports = router