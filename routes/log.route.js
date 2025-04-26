const express = require("express")
const router = express.Router()

const { getLogSchema } = require("../validations/log.validation")

const { checkJoi } = require("../middlewares/joi.middleware")

const { getLog } = require("../controllers/log.controller")



router.route("/")
    .get(checkJoi(getLogSchema, "Query"), getLog)



module.exports = router
