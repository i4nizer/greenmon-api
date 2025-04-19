const sequelize = require("../configs/sequelize.config")
const { DataTypes } = require("sequelize")

const User = sequelize.define(
	"User",
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
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: "email",
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		verified: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		disabled: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{
		timestamps: true,
		tableName: "users",
	}
)

module.exports = User
