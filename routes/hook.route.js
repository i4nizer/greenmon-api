const express = require("express")
const router = express.Router()

const { getHookSchema, postHookSchema, patchHookSchema, deleteHookSchema } = require("../validations/hook.validation")

const { checkJoi } = require("../middlewares/joi.middleware")

const { getHook, postHook, patchHook, deleteHook } = require("../controllers/hook.controller")



router.route("/")
	.get(checkJoi(getHookSchema, "Query"), getHook)
	.post(checkJoi(postHookSchema), postHook)
	.patch(checkJoi(patchHookSchema), patchHook)
	.delete(checkJoi(deleteHookSchema, "Query"), deleteHook)



module.exports = router
