const { MCU, Pin, Sensor, Output, Actuator, Input, Schedule, Threshold, Condition, Action, Hook } = require("../../models/index.model")
const { onAfterHookCreate, onAfterHookUpdate, onBeforeHookDelete } = require("./hooks/hook.hook")
const { onAfterActionCreate, onAfterActionUpdate, onBeforeActionDelete } = require("./hooks/action.hook")
const { onAfterActuatorCreate, onAfterActuatorUpdate, onBeforeActuatorDelete } = require("./hooks/actuator.hook")
const { onAfterConditionCreate, onAfterConditionUpdate, onBeforeConditionDelete } = require("./hooks/condition.hook")
const { onAfterInputCreate, onAfterInputUpdate, onBeforeInputDelete } = require("./hooks/input.hook")
const { onAfterMcuCreate, onAfterMcuUpdate, onBeforeMcuDelete } = require("./hooks/mcu.hook")
const { onAfterOutputCreate, onBeforeOutputDelete } = require("./hooks/output.hook")
const { onAfterPinCreate, onAfterPinBulkCreate, onAfterPinUpdate, onBeforePinDelete } = require("./hooks/pin.hook")
const { onAfterScheduleCreate, onAfterScheduleUpdate, onBeforeScheduleDelete } = require("./hooks/schedule.hook")
const { onAfterSensorCreate, onAfterSensorUpdate, onBeforeSensorDelete } = require("./hooks/sensor.hook")
const { onAfterThresholdCreate, onAfterThresholdUpdate, onBeforeThresholdDelete } = require("./hooks/threshold.hook")

//

/**
 * Attaches hooks after the call so that it would be available upon express bind.
 * The hooks are attached to database models.
 */
const attachWsEsp32Hooks = () => {

	// Attach action hooks
	Action.afterCreate(onAfterActionCreate)
	Action.afterUpdate(onAfterActionUpdate)
	Action.beforeDestroy(onBeforeActionDelete)
	
	// Attach actuator hooks
	Actuator.afterCreate(onAfterActuatorCreate)
	Actuator.afterUpdate(onAfterActuatorUpdate)
	Actuator.beforeDestroy(onBeforeActuatorDelete)
	
	// Attach condition hooks
	Condition.afterCreate(onAfterConditionCreate)
	Condition.afterUpdate(onAfterConditionUpdate)
	Condition.beforeDestroy(onBeforeConditionDelete)

	// Attach hook hooks
	Hook.afterCreate(onAfterHookCreate)
	Hook.afterUpdate(onAfterHookUpdate)
	Hook.beforeDestroy(onBeforeHookDelete)
	
	// Attach input hooks
	Input.afterCreate(onAfterInputCreate)
	Input.afterUpdate(onAfterInputUpdate)
	Input.beforeDestroy(onBeforeInputDelete)
	
    // Attach mcu hooks
	MCU.afterCreate(onAfterMcuCreate)
	MCU.afterUpdate(onAfterMcuUpdate)
	MCU.beforeDestroy(onBeforeMcuDelete)

	// Attach output hooks
	Output.afterCreate(onAfterOutputCreate)
	Output.afterUpdate(onAfterOutputCreate)
	Output.beforeDestroy(onBeforeOutputDelete)
	
	// Attach pin hooks
	Pin.afterBulkCreate(onAfterPinBulkCreate)
	Pin.afterCreate(onAfterPinCreate)
	Pin.afterUpdate(onAfterPinUpdate)
	Pin.beforeDestroy(onBeforePinDelete)

	// Attach schedule hooks
	Schedule.afterCreate(onAfterScheduleCreate)
	Schedule.afterUpdate(onAfterScheduleUpdate)
	Schedule.beforeDestroy(onBeforeScheduleDelete)
	
	// Attach sensor hooks
	Sensor.afterCreate(onAfterSensorCreate)
	Sensor.afterUpdate(onAfterSensorUpdate)
	Sensor.beforeDestroy(onBeforeSensorDelete)

	// Attach threshold hooks
	Threshold.afterCreate(onAfterThresholdCreate)
	Threshold.afterUpdate(onAfterThresholdUpdate)
	Threshold.beforeDestroy(onBeforeThresholdDelete)
}

//

module.exports = { attachWsEsp32Hooks }