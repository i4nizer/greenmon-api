const sequelize = require("../configs/sequelize.config")
const { DataTypes } = require("sequelize")

const Sensor = sequelize.define(
	"Sensor",
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
		interval: {
			type: DataTypes.INTEGER,
			defaultValue: 15 * 60,
		},
		lastread: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		readphase: {
			type: DataTypes.ENUM("Off", "Before", "During", "After"),
			defaultValue: "Off",
		},
		disabled: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		mcuId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "mcus",
				key: "id",
			},
			onDelete: "CASCADE",
		},
	},
	{
		timestamps: true,
		tableName: "sensors",
	}
)

module.exports = Sensor
