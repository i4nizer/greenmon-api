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
    },
    {
        timestamps: true,
        tableName: "sensors",
    }
)

module.exports = Sensor
