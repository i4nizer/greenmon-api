const sequelize = require("../configs/sequelize.config")
const { DataTypes } = require("sequelize")

const Action = sequelize.define(
	"Action",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		value: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		delay: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		duration: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		precedence: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		inputId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "inputs",
				key: "id",
			},
			onDelete: "CASCADE",
		},
		scheduleId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: "schedules",
				key: "id",
			},
			onDelete: "SET NULL",
		},
		thresholdId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: "thresholds",
				key: "id",
			},
			onDelete: "SET NULL",
		},
		greenhouseId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "greenhouses",
				key: "id",
			},
			onDelete: "CASCADE",
		},
	},
	{
		timestamps: true,
		tableName: "actions",
	}
)

// Removed relationships
module.exports = Action
