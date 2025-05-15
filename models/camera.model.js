const sequelize = require("../configs/sequelize.config")
const { DataTypes } = require("sequelize")

//

const Camera = sequelize.define(
	"Camera",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        key: {
            type: DataTypes.STRING,
            defaultValue: "Temporary Key",
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        label: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        detect: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        interval: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
		disabled: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
        },
		connected: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
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
		tableName: "cameras",
	}
)

//

module.exports = Camera
