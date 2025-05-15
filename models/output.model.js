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
		pinId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: "pins",
				key: "id",
			},
			onDelete: "SET NULL",
		},
		sensorId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "sensors",
				key: "id",
			},
			onDelete: "CASCADE",
		},
	},
	{
		timestamps: true,
		tableName: "outputs",
	}
)

module.exports = Output
