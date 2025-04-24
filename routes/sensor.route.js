const express = require('express');
const router = express.Router();

const { postSensorSchema, patchSensorSchema, deleteSensorSchema, getSensorSchema } = require('../validations/sensor.validation');

const { checkJoi } = require('../middlewares/joi.middleware');

const { getSensor, postSensor, patchSensor, deleteSensor } = require('../controllers/sensor.controller');

const hookRoutes = require('./hook.route')
const outputRoutes = require('./output.route')



router.route('/')
    .get(checkJoi(getSensorSchema, "Query"), getSensor)
    .post(checkJoi(postSensorSchema), postSensor)
    .patch(checkJoi(patchSensorSchema), patchSensor)
    .delete(checkJoi(deleteSensorSchema, "Query"), deleteSensor);

router.use('/hook', hookRoutes)
router.use('/output', outputRoutes)



module.exports = router;