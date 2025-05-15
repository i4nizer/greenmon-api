const sequelize = require("../configs/sequelize.config")
const { DataTypes } = require("sequelize")

//

const Image = sequelize.define(
	"Image",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		filename: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		cameraId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: "cameras",
				key: "id",
			},
			onDelete: "SET NULL",
		},
		greenhouseId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: "greenhouses",
				key: "id",
			},
			onDelete: "CASCADE",
		},
	},
	{
		timestamps: true,
		tableName: "images",
	}
)

//

module.exports = Image
