const sequelize = require("../configs/sequelize.config")
const { DataTypes } = require("sequelize")

const Hook = sequelize.define(
	"Hook",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		type: {
			type: DataTypes.ENUM("Before", "During", "After"),
			defaultValue: "Before",
		},
		sensorId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: "sensors",
				key: "id",
			},
			onDelete: "CASCADE",
		},
		actionId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: "actions",
				key: "id",
			},
			onDelete: "CASCADE",
		},
	},
	{
		timestamps: true,
		tableName: "hooks",
	}
)

module.exports = Hook
