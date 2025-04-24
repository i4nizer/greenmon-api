const sequelize = require("../configs/sequelize.config")
const { DataTypes } = require("sequelize")

const Log = sequelize.define(
	"Log",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		message: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		greehouseId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: "greenhouses",
				key: "id",
			},
			onDelete: "SET NULL",
		},
	},
	{
		timestamps: true,
		tableName: "logs",
	}
)

module.exports = Log
