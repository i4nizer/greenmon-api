const sequelize = require("../configs/sequelize.config")
const { DataTypes } = require("sequelize")

const Condition = sequelize.define(
	"Condition",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		type: {
			type: DataTypes.ENUM("Equal", "Above", "Below"),
			allowNull: false,
		},
		value: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		outputId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "outputs",
				key: "id",
			},
			onDelete: "CASCADE",
		},
		thresholdId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "thresholds",
				key: "id",
			},
			onDelete: "CASCADE",
		},
	},
	{
		timestamps: true,
		tableName: "conditions",
	}
)

module.exports = Condition
