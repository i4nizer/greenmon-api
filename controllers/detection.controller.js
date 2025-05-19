const { Detection } = require("../models/index.model")

//

// Get detections with paging support (limit, offset)
const getDetection = async (req, res, next) => {
	try {
		const { imageId, class: className } = req.query

		const filter = {}
		if (imageId) filter.imageId = imageId
		if (className) filter.class = className

		const detections = await Detection.findAll({
			where: filter,
		})

        res.json({ detections })
        
	} catch (error) {
		next(error)
	}
}

//

module.exports = {
	getDetection,
}
