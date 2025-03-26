const express = require('express');
const router = express.Router();

const { postActuatorSchema, patchActuatorSchema, deleteActuatorSchema, getActuatorSchema } = require('../validations/actuator.validation');

const { checkJoi } = require('../middlewares/joi.middleware');

const { getActuator, postActuator, patchActuator, deleteActuator } = require('../controllers/actuator.controller');

const inputRoutes = require('./input.route')



router.route('/')
    .get(checkJoi(getActuatorSchema, "Query"), getActuator)
    .post(checkJoi(postActuatorSchema), postActuator)
    .patch(checkJoi(patchActuatorSchema), patchActuator)
    .delete(checkJoi(deleteActuatorSchema, "Query"), deleteActuator);

router.use('/input', inputRoutes)



module.exports = router;