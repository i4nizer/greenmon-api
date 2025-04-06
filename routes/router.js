const cors = require("cors")
const express = require("express")
const router = express.Router()
const path = require('path')
const env = require("../configs/env.config")

const { errorMiddleware } = require("../middlewares/error.middleware")
const { loggerMiddleware } = require("../middlewares/logger.middleware")

const userRoutes = require("./user.route")

router.use(cors({ origin: [env.clientDomain], credentials: true }))
router.use(express.json())
router.use(loggerMiddleware)

router.use("/user", userRoutes)
router.use("/models", express.static(path.join(__dirname, "../models")))

router.use(errorMiddleware)

module.exports = router
