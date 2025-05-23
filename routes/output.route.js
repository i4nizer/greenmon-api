const express = require("express")
const router = express.Router()

const { getOutputSchema, postOutputSchema, patchOutputSchema, deleteOutputSchema } = require("../validations/output.validation")

const { checkJoi } = require("../middlewares/joi.middleware")

const { getOutput, postOutput, patchOutput, deleteOutput } = require("../controllers/output.controller")

//

router
	.route("/")
	.get(checkJoi(getOutputSchema, "query"), getOutput)
	.post(checkJoi(postOutputSchema), postOutput)
	.patch(checkJoi(patchOutputSchema), patchOutput)
	.delete(checkJoi(deleteOutputSchema, "query"), deleteOutput)

//

module.exports = router
