const sequelize = require("../configs/sequelize.config")
const { DataTypes } = require("sequelize")

const Alert = sequelize.define(
	"Alert",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		message: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		severity: {
			type: DataTypes.ENUM("Info", "Success", "Warning", "Error"),
			defaultValue: "Info"
		},
        viewed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        emailed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
		greenhouseId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: "greenhouses",
				key: "id",
			},
			onDelete: "SET NULL",
        },
		userId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: "users",
				key: "id",
			},
			onDelete: "CASCADE",
        },
	},
	{
		timestamps: true,
		tableName: "alerts",
	}
)

module.exports = Alert
