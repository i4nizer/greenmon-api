const express = require("express")
const router = express.Router()

const { getAlertSchema } = require("../validations/alert.validation")

const { checkJoi } = require("../middlewares/joi.middleware")

const { getAlert } = require("../controllers/alert.controller")

//

router
    .route("/")
    .get(checkJoi(getAlertSchema, "query"), getAlert)

//

module.exports = router
