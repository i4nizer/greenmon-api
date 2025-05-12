const env = require("../configs/env.config")
const cors = require("cors")
const express = require("express")
const router = express.Router()

const { errorMiddleware } = require("../middlewares/error.middleware")
const { loggerMiddleware } = require("../middlewares/logger.middleware")
const { checkApiKey } = require("../middlewares/token.middleware")

const userRoutes = require("./user.route")
const esp32Routes = require("./esp32.route")

//

router.use(cors({ origin: ["*", env.clientDomain], credentials: false }))
router.use(express.json())
router.use(loggerMiddleware)

router.use("/user", userRoutes)
router.use("/esp32", checkApiKey, esp32Routes)

router.use(errorMiddleware)

//

module.exports = router
