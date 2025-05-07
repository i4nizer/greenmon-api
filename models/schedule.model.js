const sequelize = require("../configs/sequelize.config")
const { DataTypes } = require("sequelize")

const Schedule = sequelize.define(
	"Schedule",
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
		days: {
			type: DataTypes.JSON,
			defaultValue: [],
		},
		times: {
			type: DataTypes.JSON,
			defaultValue: [],
		},
		activated: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		disabled: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
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
		tableName: "schedules",
	}
)

module.exports = Schedule
