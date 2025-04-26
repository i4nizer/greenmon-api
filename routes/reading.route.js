const express = require("express")
const router = express.Router()

const { getReadingSchema } = require("../validations/reading.validation")

const { checkJoi } = require("../middlewares/joi.middleware")

const { getReading } = require("../controllers/reading.controller")



router.route("/")
    .get(checkJoi(getReadingSchema, "Query"), getReading)



module.exports = router
