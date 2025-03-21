const MCU = require("./mcu.model")
const sequelize = require("../configs/sequelize.config")
const { DataTypes } = require("sequelize")

const Pin = sequelize.define(
	"Pin",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		type: {
			type: DataTypes.ENUM("Digital", "Analog"),
			defaultValue: "Digital",
		},
		mode: {
			type: DataTypes.ENUM("Unset", "Input", "Output", "Other"),
			defaultValue: "Unset",
		},
		number: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		mcuId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: MCU,
				key: "id",
			},
			onDelete: "CASCADE",
		},
	},
	{
		timestamps: true,
		tableName: "pins",
	}
)

// Define relationships
MCU.hasMany(Pin, { foreignKey: "mcuId", onDelete: "CASCADE" })
Pin.belongsTo(MCU, { foreignKey: "mcuId" })

module.exports = Pin
