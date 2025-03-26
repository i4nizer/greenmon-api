const MCU = require('./mcu.model');
const sequelize = require("../configs/sequelize.config");
const { DataTypes } = require("sequelize");

const Actuator = sequelize.define(
	"Actuator",
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
		disabled: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
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
		tableName: "actuators",
	}
)

// Define relationships
MCU.hasMany(Actuator, { foreignKey: "mcuId", onDelete: "CASCADE" });
Actuator.belongsTo(MCU, { foreignKey: "mcuId" });

module.exports = Actuator;