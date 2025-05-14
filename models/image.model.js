const sequelize = require("../configs/sequelize.config")
const { DataTypes } = require("sequelize")

const Image = sequelize.define(
	"Image",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		icon: {
			type: DataTypes.STRING,
			defaultValue: "mdi-thermometer",
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		unit: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		filename: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		completed: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		outputId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: "outputs",
				key: "id",
			},
			onDelete: "SET NULL",
		},
	},
	{
		timestamps: true,
		tableName: "images",
	}
)

module.exports = Image
