const { Image } = require("../models/index.model")
const { AppError } = require("../utils/app-error.util")

//

/** Responds with create success. */
const postImageEsp32 = async (req, res, next) => {
    try {
        if (!req.file) return next(new AppError(400, "Image upload failed."))

        const { icon, name, unit, outputId } = req.body
        const imageDoc = await Image.create({
            icon,
            name,
            unit,
            path: req.file.filename,
            outputId,
        }, {
            source: "client",
        })

        res.json({ text: "Image uploaded successfully.", image: imageDoc })
        
    } catch (error) {
        next(error)
    }
}

//

module.exports = {
    postImageEsp32,
}