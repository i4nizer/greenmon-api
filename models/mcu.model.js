const sequelize = require("../configs/sequelize.config")
const { DataTypes } = require("sequelize")

const MCU = sequelize.define(
	"MCU",
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
		label: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		key: {
			type: DataTypes.STRING,
			defaultValue: "Temporary Key",
		},
		connected: {
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
		tableName: "mcus",
	}
)

module.exports = MCU
