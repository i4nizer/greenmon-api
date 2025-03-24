const Pin = require("./pin.model")
const Sensor = require("./sensor.model")
const sequelize = require("../configs/sequelize.config")
const { DataTypes } = require("sequelize")

const Output = sequelize.define(
	"Output",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		icon: {
			type: DataTypes.STRING,
			defaultValue: "mdi-thermometer",
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		unit: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		type: {
			type: DataTypes.ENUM("Number", "Image"),
			defaultValue: "Number",
		},
		pinId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: Pin,
				key: "id",
			},
			onDelete: "SET NULL",
		},
		sensorId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Sensor,
				key: "id",
			},
			onDelete: "CASCADE",
		},
	},
	{
		timestamps: true,
		tableName: "output",
	}
)

// Define relationships
Pin.hasMany(Output, { foreignKey: "pinId", onDelete: "SET NULL" })
Sensor.hasMany(Output, { foreignKey: "sensorId", onDelete: "CASCADE" })
Output.belongsTo(Pin, { foreignKey: "pinId" })
Output.belongsTo(Sensor, { foreignKey: "sensorId" })

module.exports = Output
