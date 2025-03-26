const express = require('express');
const router = express.Router();

const { postMcuSchema, patchMcuSchema, deleteMcuSchema } = require('../validations/mcu.validation')

const { checkJoi } = require('../middlewares/joi.middleware')

const { getMcu, postMcu, patchMcu, deleteMcu } = require('../controllers/mcu.controller');

const pinRoutes = require('./pin.route')
const sensorRoutes = require('./sensor.route')
const actuatorRoutes = require('./actuator.route')



router.route('/')
    .get(getMcu)
    .post(checkJoi(postMcuSchema), postMcu)
    .patch(checkJoi(patchMcuSchema), patchMcu)
    .delete(checkJoi(deleteMcuSchema, "Query"), deleteMcu);

router.use('/pin', pinRoutes)
router.use('/sensor', sensorRoutes)
router.use('/actuator', actuatorRoutes)



module.exports = router;