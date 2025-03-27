const sequelize = require("../configs/sequelize.config")
const { DataTypes } = require("sequelize")

const Token = sequelize.define(
	"Token",
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
			type: DataTypes.ENUM("Access", "Refresh", "Api"),
			defaultValue: "Refresh",
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
		tableName: "tokens",
		indexes: [
			{
				unique: true,
				fields: ["userId", "type"],
				where: {
					type: {
						[sequelize.Sequelize.Op.ne]: "Api",
					},
				},
			},
		],
	}
)

module.exports = Token
