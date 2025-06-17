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
		timeout: {
			type: DataTypes.INTEGER,	// limits execution time, must be inactive before this
			defaultValue: 10000,		// purpose is to avoid hanging actions
		},
		duration: {
			type: DataTypes.INTEGER,	// returns to previous state after this duration
			defaultValue: -1,			// purpose is to make actions that reverts input to its previous state
		},
		priority: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		status: {
			type: DataTypes.ENUM("Inactive", "Delayed", "Active", "Discarded", "Interrupted", "Timeout"),
			defaultValue: "Inactive",
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
