const express = require("express")
const router = express.Router()
const path = require("path")

const {
	signUpSchema,
	accountVerificationOTPSchema,
	resendAccountVerificationOTPSchema,
	signInSchema,
	forgotPasswordSchema,
	resetPasswordOTPSchema,
	resetPasswordSchema,
	updateUserSchema,
} = require("../validations/user.validation")

const { checkJoi } = require("../middlewares/joi.middleware")
const { checkAccessToken, checkRefreshToken } = require("../middlewares/token.middleware")

const {
	postSignUp,
	postAccountVerificationOTP,
	postResendAccountVerificationOTP,
	postSignIn,
	postSignOut,
	postForgotPassword,
	postResetPassword,
	patchUser,
	postRotateToken,
	postResetPasswordOTP,
} = require("../controllers/user.controller")

const greenhouseRoutes = require("./greenhouse.route")

//

router.patch("/", checkJoi(updateUserSchema), checkAccessToken, patchUser)

router.post("/sign-up", checkJoi(signUpSchema), postSignUp)

router.post("/account-verification-otp", checkJoi(accountVerificationOTPSchema), postAccountVerificationOTP)
router.post("/resend-account-verification-otp", checkJoi(resendAccountVerificationOTPSchema), postResendAccountVerificationOTP)

router.post("/sign-in", checkJoi(signInSchema), postSignIn)
router.post("/sign-out", checkAccessToken, checkRefreshToken, postSignOut)
router.post("/rotate-token", checkRefreshToken, postRotateToken)

router.post("/forgot-password", checkJoi(forgotPasswordSchema), postForgotPassword)
router.post("/reset-password-otp", checkJoi(resetPasswordOTPSchema), postResetPasswordOTP)
router.post("/reset-password", checkJoi(resetPasswordSchema), postResetPassword)

router.use("/model", checkAccessToken, express.static(path.join(__dirname, "../ai")))
router.use("/greenhouse", checkAccessToken, greenhouseRoutes)

//

module.exports = router
