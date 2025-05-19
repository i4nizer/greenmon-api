const cors = require("cors")
const express = require("express")
const router = express.Router()
const path = require("path")

const { errorMiddleware } = require("../middlewares/error.middleware")
const { loggerMiddleware } = require("../middlewares/logger.middleware")

const userRoutes = require("./user.route")

//

router.use(cors({ origin: ["*", env.clientDomain], credentials: false }))
router.use(express.json())
router.use(loggerMiddleware)

router.use("/user", userRoutes)
router.use("/model", express.static(path.join(__dirname, "../ai")))

router.use(errorMiddleware)

//

module.exports = router
