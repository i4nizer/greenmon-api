const sequelize = require("../configs/sequelize.config")
const { DataTypes } = require("sequelize")

const Threshold = sequelize.define(
	"Threshold",
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
		operator: {
			type: DataTypes.ENUM("Any", "All"),
			defaultValue: "Any",
		},
		activated: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		disabled: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
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
		tableName: "thresholds",
	}
)

module.exports = Threshold
