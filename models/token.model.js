const User = require("./user.model")
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
				model: User,
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

// Define relationships
User.hasMany(Token, { foreignKey: "userId", onDelete: "CASCADE" })
Token.belongsTo(User, { foreignKey: "userId" })

module.exports = Token
