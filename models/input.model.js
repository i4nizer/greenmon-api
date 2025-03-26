const Pin = require("./pin.model");
const Actuator = require("./actuator.model");
const sequelize = require("../configs/sequelize.config");
const { DataTypes } = require("sequelize");

const Input = sequelize.define(
    "Input",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        icon: {
            type: DataTypes.STRING,
            defaultValue: 'mdi-fan',
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('Boolean', 'Number'),
            allowNull: false,
        },
        flag: {
            type: DataTypes.INTEGER,
            defaultValue: -1,
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: -1,
        },
        pinId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Pin,
                key: "id",
            },
            onDelete: "SET NULL",
        },
        actuatorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Actuator,
                key: "id",
            },
            onDelete: "CASCADE",
        },
    },
    {
        timestamps: true,
        tableName: "inputs",
    }
);

// Define relationships
Pin.hasMany(Input, { foreignKey: "pinId", onDelete: "SET NULL" });
Actuator.hasMany(Input, { foreignKey: "actuatorId", onDelete: "CASCADE" });
Input.belongsTo(Pin, { foreignKey: "pinId" });
Input.belongsTo(Actuator, { foreignKey: "actuatorId" });

module.exports = Input;