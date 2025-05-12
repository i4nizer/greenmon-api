const express = require("express")
const router = express.Router()

const {
	getConditionSchema,
	postConditionSchema,
	patchConditionSchema,
	deleteConditionSchema,
} = require("../validations/condition.validation")

const { checkJoi } = require("../middlewares/joi.middleware")

const { getCondition, postCondition, patchCondition, deleteCondition } = require("../controllers/condition.controller")

//

router
	.route("/")
	.get(checkJoi(getConditionSchema, "query"), getCondition)
	.post(checkJoi(postConditionSchema), postCondition)
	.patch(checkJoi(patchConditionSchema), patchCondition)
	.delete(checkJoi(deleteConditionSchema, "query"), deleteCondition)

//

module.exports = router
