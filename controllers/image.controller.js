const { Op } = require("sequelize")
const { Image } = require("../models/index.model")

//

// Get images with paging support (limit, offset)
const getImage = async (req, res, next) => {
	try {
		const { limit, offset, cameraId, greenhouseId, year, month } = req.query

		const filter = {}
		if (cameraId) filter.cameraId = cameraId
		if (greenhouseId) filter.greenhouseId = greenhouseId
        if (year && month) {
            const xDate = new Date(year, parseInt(month, 10), 1)
            const yDate = new Date(year, parseInt(month, 10) +  1, 1)
			filter.createdAt = { [Op.between]: [xDate, yDate] }
        }

		const images = await Image.findAll({
			where: filter,
			order: [["createdAt", "DESC"]],
			...(limit && { limit: parseInt(limit, 10) }),
			...(offset && { offset: parseInt(offset, 10) }),
        })
        
        const count = await Image.count({ where: filter })

        res.json({ images, count })
        
	} catch (error) {
		next(error)
	}
}

//

module.exports = {
	getImage,
}
