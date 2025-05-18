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
        format: {
            type: DataTypes.ENUM(
                "PIXFORMAT_RG656", "PIXFORMAT_YUV422", "PIXFORMAT_YUV420", "PIXFORMAT_GRAYSCALE", 
                "PIXFORMAT_JPEG", "PIXFORMAT_RGB888", "PIXFORMAT_RAW", "PIXFORMAT_RGB444", 
                "PIXFORMAT_RGB555"
            ),
            defaultValue: "PIXFORMAT_JPEG",
        },
        quality: {
            type: DataTypes.INTEGER,
            defaultValue: 12,
        },
        resolution: {
            type: DataTypes.ENUM(
                "FRAMESIZE_96X96", "FRAMESIZE_QQVGA", "FRAMESIZE_QCIF", "FRAMESIZE_HQVGA", 
                "FRAMESIZE_240X240", "FRAMESIZE_QVGA", "FRAMESIZE_CIF", "FRAMESIZE_HVGA",
                "FRAMESIZE_VGA", "FRAMESIZE_SVGA", "FRAMESIZE_XGA", "FRAMESIZE_HD",
                "FRAMESIZE_SXGA", "FRAMESIZE_UXGA", "FRAMESIZE_FHD", "FRAMESIZE_P_HD",
                "FRAMESIZE_P_3MP", "FRAMESIZE_QXGA", "FRAMESIZE_QHD", "FRAMESIZE_WQXGA",
                "FRAMESIZE_P_FHD", "FRAMESIZE_QSXGA"
            ),
            defaultValue: "FRAMESIZE_UXGA",
        },
        realtime: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
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
