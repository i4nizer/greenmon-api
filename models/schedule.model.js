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
		disabled: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		activated: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
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
