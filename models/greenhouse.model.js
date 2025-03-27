const sequelize = require("../configs/sequelize.config")
const { DataTypes } = require("sequelize")

const Greenhouse = sequelize.define(
	"Greenhouse",
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
		description: {
			type: DataTypes.STRING(500),
			allowNull: true,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "users",
				key: "id",
			},
			onDelete: "CASCADE",
		},
	},
	{
		timestamps: true,
		tableName: "greenhouses",
	}
)

module.exports = Greenhouse
