const Greenhouse = require("./greenhouse.model")
const sequelize = require("../configs/sequelize.config")
const { DataTypes } = require("sequelize")

const MCU = sequelize.define(
	"MCU",
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
		key: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		greenhouseId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Greenhouse,
				key: "id",
			},
			onDelete: "CASCADE",
		},
	},
	{
		timestamps: true,
		tableName: "mcus",
	}
)

// Define relationships
Greenhouse.hasMany(MCU, { foreignKey: "greenhouseId", onDelete: "CASCADE" })
MCU.belongsTo(Greenhouse, { foreignKey: "greenhouseId" })

module.exports = MCU
