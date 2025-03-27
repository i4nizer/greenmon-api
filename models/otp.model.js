const sequelize = require("../configs/sequelize.config")
const { DataTypes } = require("sequelize")

const OTP = sequelize.define(
	"OTP",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		hash: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		type: {
			type: DataTypes.ENUM("Account Verification", "Password Reset"),
			defaultValue: "Account Verification",
		},
		revoked: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		expiry: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "users",
				key: "id",
			},
			onDelete: "CASCADE",
		},
	},
	{
		timestamps: true,
		tableName: "otps",
		indexes: [
			{
				unique: true,
				fields: ["userId", "type"],
			},
		],
	}
)

module.exports = OTP
