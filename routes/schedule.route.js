const express = require('express');
const router = express.Router();

const { getScheduleSchema, postScheduleSchema, patchScheduleSchema, deleteScheduleSchema } = require('../validations/schedule.validation');

const { checkJoi } = require('../middlewares/joi.middleware');

const { getSchedule, postSchedule, patchSchedule, deleteSchedule } = require('../controllers/schedule.controller');



router.route('/')
    .get(checkJoi(getScheduleSchema, "Query"), getSchedule)
    .post(checkJoi(postScheduleSchema), postSchedule)
    .patch(checkJoi(patchScheduleSchema), patchSchedule)
    .delete(checkJoi(deleteScheduleSchema, "Query"), deleteSchedule);



module.exports = router;