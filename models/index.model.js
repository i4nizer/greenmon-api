const sequelize = require("../configs/sequelize.config")
const sequelizeStream = require("node-sequelize-stream")

const User = require("./user.model")
const OTP = require("./otp.model")
const Token = require("./token.model")

const Greenhouse = require("./greenhouse.model")
const Camera = require("./camera.model")

const MCU = require("./mcu.model")
const Pin = require("./pin.model")

const Sensor = require("./sensor.model")
const Hook = require("./hook.model")
const Output = require("./output.model")

const Actuator = require("./actuator.model")
const Input = require("./input.model")

const Schedule = require("./schedule.model")
const Action = require("./action.model")
const Threshold = require("./threshold.model")
const Condition = require("./condition.model")

const Log = require("./log.model")
const Alert = require("./alert.model")
const Image = require("./image.model")
const Reading = require("./reading.model")
const Detection = require("./detection.model")

//

// Define User relationships
User.hasMany(OTP, { foreignKey: "userId", onDelete: "CASCADE" })
User.hasMany(Token, { foreignKey: "userId", onDelete: "CASCADE" })
User.hasMany(Greenhouse, { foreignKey: "userId", onDelete: "CASCADE" })
User.hasMany(Alert, { foreignKey: "userId", onDelete: "SET NULL" })

// Define OTP relationships
OTP.belongsTo(User, { foreignKey: "userId" })

// Define Token relationships
Token.belongsTo(User, { foreignKey: "userId" })


// Define Greenhouse relationships
Greenhouse.belongsTo(User, { foreignKey: "userId" })
Greenhouse.hasMany(Camera, { foreignKey: "greenhouseId", onDelete: "CASCADE" })
Greenhouse.hasMany(MCU, { foreignKey: "greenhouseId", onDelete: "CASCADE" })
Greenhouse.hasMany(Schedule, { foreignKey: "greenhouseId", onDelete: "CASCADE" })
Greenhouse.hasMany(Threshold, { foreignKey: "greenhouseId", onDelete: "CASCADE" })
Greenhouse.hasMany(Log, { foreignKey: "greenhouseId", onDelete: "CASCADE" })
Greenhouse.hasMany(Alert, { foreignKey: "greenhouseId", onDelete: "SET NULL" })

// Define Camera relationships
Camera.belongsTo(Greenhouse, { foreignKey: "greenhouseId" })
Camera.hasMany(Image, { foreignKey: "cameraId", onDelete: "SET NULL" })

// Define MCU relationships
MCU.belongsTo(Greenhouse, { foreignKey: "greenhouseId" })
MCU.hasMany(Pin, { foreignKey: "mcuId", onDelete: "CASCADE" })
MCU.hasMany(Sensor, { foreignKey: "mcuId", onDelete: "CASCADE" })
MCU.hasMany(Actuator, { foreignKey: "mcuId", onDelete: "CASCADE" })

// Define Pin relationships
Pin.belongsTo(MCU, { foreignKey: "mcuId" })
Pin.hasMany(Input, { foreignKey: "pinId", onDelete: "SET NULL" })
Pin.hasMany(Output, { foreignKey: "pinId", onDelete: "SET NULL" })

// Define Sensor relationships
Sensor.belongsTo(MCU, { foreignKey: "mcuId" })
Sensor.hasMany(Output, { foreignKey: "sensorId", onDelete: "CASCADE" })
Sensor.hasMany(Hook, { foreignKey: "sensorId", onDelete: "CASCADE" })
Sensor.beforeDestroy(async (sensor, options) => {
    const outputs = await Output.findAll({ where: { sensorId: sensor.id } })
    await Promise.all(outputs.map(o => Pin.update({ mode: 'Unset' }, { where: { id: o.pinId } })))
})

// Define Hook relationships
Hook.belongsTo(Sensor, { foreignKey: "sensorId" })

// Define Output relationships
Output.belongsTo(Pin, { foreignKey: "pinId" })
Output.belongsTo(Sensor, { foreignKey: "sensorId" })
Output.hasMany(Condition, { foreignKey: "outputId", onDelete: "CASCADE" })
Output.hasMany(Reading, { foreignKey: "outputId", onDelete: "SET NULL" })

// Define Actuator relationships
Actuator.belongsTo(MCU, { foreignKey: "mcuId" })
Actuator.hasMany(Input, { foreignKey: "actuatorId", onDelete: "CASCADE" })
Actuator.beforeDestroy(async (actuator, options) => {
    const inputs = await Input.findAll({ where: { actuatorId: actuator.id } })
    await Promise.all(inputs.map(i => Pin.update({ mode: 'Unset' }, { where: { id: i.pinId } })))
})

// Define Input relationships
Input.belongsTo(Pin, { foreignKey: "pinId" })
Input.belongsTo(Actuator, { foreignKey: "actuatorId" })
Input.hasMany(Action, { foreignKey: "inputId", onDelete: "CASCADE" })


// Define Schedule relationships
Schedule.belongsTo(Greenhouse, { foreignKey: "greenhouseId" })
Schedule.hasMany(Action, { foreignKey: "scheduleId", onDelete: "SET NULL" })
Schedule.beforeDestroy(async (schedule, options) => {
	const filter = { thresholdId: null, scheduleId: schedule.id }
	await Action.destroy({ where: filter })
})

// Define Threshold relationships
Threshold.belongsTo(Greenhouse, { foreignKey: "greenhouseId" })
Threshold.hasMany(Action, { foreignKey: "thresholdId", onDelete: "SET NULL" })
Threshold.hasMany(Condition, { foreignKey: "thresholdId", onDelete: "CASCADE" })
Threshold.beforeDestroy(async (threshold, options) => {
	const filter = { scheduleId: null, thresholdId: threshold.id }
	await Action.destroy({ where: filter })
})

// Define Condition relationships
Condition.belongsTo(Output, { foreignKey: "outputId" })
Condition.belongsTo(Threshold, { foreignKey: "thresholdId" })

// Define Action relationships
Action.belongsTo(Input, { foreignKey: "inputId" })
Action.belongsTo(Schedule, { foreignKey: "scheduleId" })
Action.belongsTo(Threshold, { foreignKey: "thresholdId" })
Action.belongsTo(Greenhouse, { foreignKey: "greenhouseId" })


// Define Log relationships
Log.belongsTo(Greenhouse, { foreignKey: "greenhouseId" })

// Define Image relationships
Image.belongsTo(Camera, { foreignKey: "cameraId" })
Image.hasMany(Detection, { foreignKey: "imageId", onDelete: "CASCADE" })

// Define Reading relationships
Reading.belongsTo(Output, { foreignKey: "outputId" })

// Define Detection relationships
Detection.belongsTo(Image, { foreignKey: "imageId" })

// Define Alert relationships
Alert.belongsTo(User, { foreignKey: "userId" })
Alert.belongsTo(Greenhouse, { foreignKey: "greenhouseId" })


// Allow data streaming
sequelizeStream(sequelize, 100, true)

//

// Export models
module.exports = {
	sequelize,

    User,
    OTP,
    Token,

    Greenhouse,
    Camera,
    
    MCU,
    Pin,
    
    Sensor,
    Hook,
    Output,
    
    Actuator,
    Input,

    Schedule,
    Action,
    Threshold,
    Condition,

    Log,
    Alert,
    Image,
    Reading,
    Detection,
}
