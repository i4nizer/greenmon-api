const { Log, Reading, Action, Alert, Condition, Image, Input, Schedule, Sensor, Threshold } = require('../../models/index.model')
const { onAfterActionUpdate } = require('./hooks/action.hook')
const { onAfterAlertCreate } = require('./hooks/alert.hook')
const { onAfterConditionUpdate } = require('./hooks/condition.hook')
const { onAfterImageCreate } = require('./hooks/image.hook')
const { onAfterInputUpdate } = require('./hooks/input.hook')
const { onAfterLogCreate } = require('./hooks/log.hook')
const { onAfterReadingCreate } = require('./hooks/reading.hook')
const { onAfterScheduleUpdate } = require('./hooks/schedule.hook')
const { onAfterSensorUpdate } = require('./hooks/sensor.hook')
const { onAfterThresholdUpdate } = require('./hooks/threshold.hook')

//

/**
 * Attaches hooks after the call so that it would be available upon express bind.
 * The hooks are attached to database models.
 */
const attachWsClientHooks = () => {
	
    // Attach action hooks
    Action.afterUpdate(onAfterActionUpdate)

    // Attach alert hooks
    Alert.afterCreate(onAfterAlertCreate)

    // Attach condition hooks
    Condition.afterUpdate(onAfterConditionUpdate)

    // Attach image hooks
    Image.afterCreate(onAfterImageCreate)

    // Attach input hooks
    Input.afterUpdate(onAfterInputUpdate)

    // Attach log hooks
    Log.afterCreate(onAfterLogCreate)

    // Attach reading hooks
    Reading.afterCreate(onAfterReadingCreate)

    // Attach schedule hooks
    Schedule.afterUpdate(onAfterScheduleUpdate)

    // Attach sensor hooks
    Sensor.afterUpdate(onAfterSensorUpdate)

    // Attach threshold hooks
    Threshold.afterUpdate(onAfterThresholdUpdate)
}

//

module.exports = { attachWsClientHooks }