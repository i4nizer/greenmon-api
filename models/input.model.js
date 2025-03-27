const sequelize = require("../configs/sequelize.config")
const { DataTypes } = require("sequelize")

const Input = sequelize.define(
	"Input",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		icon: {
			type: DataTypes.STRING,
			defaultValue: "mdi-fan",
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		type: {
			type: DataTypes.ENUM("Boolean", "Number"),
			allowNull: false,
		},
		flag: {
			type: DataTypes.INTEGER,
			defaultValue: -1,
		},
		status: {
			type: DataTypes.INTEGER,
			defaultValue: -1,
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
		actuatorId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "actuators",
				key: "id",
			},
			onDelete: "CASCADE",
		},
	},
	{
		timestamps: true,
		tableName: "inputs",
	}
)

module.exports = Input
