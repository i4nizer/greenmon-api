const sequelize = require("../configs/sequelize.config")
const { DataTypes } = require("sequelize")

const Detection = sequelize.define(
	"Detection",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
        class: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        confidence: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        x: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        y: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        w: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        h: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
		imageId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "images",
				key: "id",
			},
			onDelete: "CASCADE",
		},
	},
	{
		timestamps: true,
		tableName: "detections",
	}
)

module.exports = Detection
