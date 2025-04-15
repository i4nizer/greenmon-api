const {
	MCU,
	Pin,
	Sensor,
	Output,
	Actuator,
	Input,
	Schedule,
	Threshold,
	Condition,
	Action,
} = require("../../models/index.model")
const { onAfterActionCreate, onAfterActionUpdate } = require("./hooks/action.hook")
const { onBeforeActuatorDelete } = require("./hooks/actuator.hook")
const { onAfterInputCreate, onAfterInputUpdate, onBeforeInputDelete } = require("./hooks/input.hook")
const { onAfterMcuCreate, onAfterMcuUpdate, onBeforeMcuDelete } = require("./hooks/mcu.hook")
const { onAfterOutputCreate, onBeforeOutputDelete } = require("./hooks/output.hook")
const { onAfterPinCreate, onAfterPinBulkCreate, onAfterPinUpdate, onBeforePinDelete } = require("./hooks/pin.hook")
const { onAfterScheduleCreate, onAfterScheduleUpdate, onBeforeScheduleDelete } = require("./hooks/schedule.hook")
const { onAfterSensorCreate, onAfterSensorUpdate, onBeforeSensorDelete } = require("./hooks/sensor.hook")
const { onAfterThresholdCreate, onAfterThresholdUpdate, onBeforeThresholdDelete } = require("./hooks/threshold.hook")



/**
 * Attaches hooks after the call so that it would be available upon express bind.
 * The hooks are attached to database models.
 */
const attachWsEsp32Hooks = () => {
	
    // Attach mcu hooks
	MCU.afterCreate(onAfterMcuCreate)
	MCU.afterUpdate(onAfterMcuUpdate)
	MCU.beforeDestroy(onBeforeMcuDelete)

	// Attach pin hooks
	Pin.afterBulkCreate(onAfterPinBulkCreate)
	Pin.afterCreate(onAfterPinCreate)
	Pin.afterUpdate(onAfterPinUpdate)
	Pin.beforeDestroy(onBeforePinDelete)

	// Attach sensor hooks
	Sensor.afterCreate(onAfterSensorCreate)
	Sensor.afterUpdate(onAfterSensorUpdate)
	Sensor.beforeDestroy(onBeforeSensorDelete)

	// Attach output hooks
	Output.afterCreate(onAfterOutputCreate)
	Output.afterUpdate(onAfterOutputCreate)
	Output.beforeDestroy(onBeforeOutputDelete)

	// Attach actuator hooks
	Actuator.afterCreate(onAfterActionCreate)
	Actuator.afterUpdate(onAfterActionUpdate)
	Actuator.beforeDestroy(onBeforeActuatorDelete)

	// Attach input hooks
	Input.afterCreate(onAfterInputCreate)
	Input.afterUpdate(onAfterInputUpdate)
	Input.beforeDestroy(onBeforeInputDelete)

	// Attach schedule hooks
	Schedule.afterCreate(onAfterScheduleCreate)
	Schedule.afterUpdate(onAfterScheduleUpdate)
	Schedule.beforeDestroy(onBeforeScheduleDelete)

	// Attach threshold hooks
	Threshold.afterCreate(onAfterThresholdCreate)
	Threshold.afterUpdate(onAfterThresholdUpdate)
	Threshold.beforeDestroy(onBeforeThresholdDelete)
}



module.exports = { attachWsEsp32Hooks }