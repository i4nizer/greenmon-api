const User = require("./user.model")
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
			type: DataTypes.TEXT(500),
			allowNull: true,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
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

// Define relationships
User.hasMany(Greenhouse, { foreignKey: "userId", onDelete: "CASCADE" })
Greenhouse.belongsTo(User, { foreignKey: "userId" })

module.exports = Greenhouse
