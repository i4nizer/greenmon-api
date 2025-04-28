const express = require("express")
const router = express.Router()

const { getReadingSchema } = require("../validations/reading.validation")

const { checkJoi } = require("../middlewares/joi.middleware")

const { getReading, getReadingCsv } = require("../controllers/reading.controller")



router.route("/")
    .get(checkJoi(getReadingSchema, "Query"), getReading)
router.route("/csv")
    .get(checkJoi(getReadingSchema, "Query"), getReadingCsv)



module.exports = router
