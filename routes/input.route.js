const express = require('express');
const router = express.Router();

const { getInputSchema, postInputSchema, patchInputSchema, deleteInputSchema } = require('../validations/input.validation');

const { checkJoi } = require('../middlewares/joi.middleware');

const { getInput, postInput, patchInput, deleteInput } = require('../controllers/input.controller');



router.route('/')
    .get(checkJoi(getInputSchema, "Query"), getInput)
    .post(checkJoi(postInputSchema), postInput)
    .patch(checkJoi(patchInputSchema), patchInput)
    .delete(checkJoi(deleteInputSchema, "Query"), deleteInput);


    
module.exports = router;