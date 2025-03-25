const MCU = require('./mcu.model')
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
        tableName: "sensors",
    }
)

// Define relationships
MCU.hasMany(Sensor, { foreignKey: "mcuId", onDelete: "CASCADE" })
Sensor.belongsTo(MCU, { foreignKey: "mcuId" })

module.exports = Sensor
