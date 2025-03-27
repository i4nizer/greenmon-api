const express = require('express');
const router = express.Router();

const { getActionSchema, postActionSchema, patchActionSchema, deleteActionSchema } = require('../validations/action.validation');

const { checkJoi } = require('../middlewares/joi.middleware');

const { getAction, postAction, patchAction, deleteAction } = require('../controllers/action.controller');



router.route('/')
    .get(checkJoi(getActionSchema, "Query"), getAction)
    .post(checkJoi(postActionSchema), postAction)
    .patch(checkJoi(patchActionSchema), patchAction)
    .delete(checkJoi(deleteActionSchema, "Query"), deleteAction);


    
module.exports = router;