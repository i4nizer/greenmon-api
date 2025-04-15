const sequelize = require("../configs/sequelize.config")
const { DataTypes } = require("sequelize")

const Reading = sequelize.define(
    "Reading",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        icon: {
            type: DataTypes.STRING,
            defaultValue: "mdi-thermometer",
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        unit: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        value: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
        },
        outputId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "outputs",
                key: "id",
            },
            onDelete: "SET NULL",
        },
    },
    {
        timestamps: true,
        tableName: "readings",
    }
)

module.exports = Reading
