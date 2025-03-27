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
	},
	{
		timestamps: true,
		tableName: "actions",
		validate: {
			mustHaveScheduleOrThreshold() {
				if (!this.scheduleId && !this.thresholdId) {
					throw new Error("An action must reference a schedule or a threshold.")
				}
			},
		},
	}
)

// Removed relationships
module.exports = Action
