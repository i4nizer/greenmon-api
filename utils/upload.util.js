const path = require('path')
const multer = require('multer')
const { AppError } = require('./app-error.util')



/**
 * The directory of all uploaded images from api.
 */
const _uploadDir = path.join(__dirname, "../uploads")

/**
 * Defines where and how the files will be stored.
 */
const _storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, _uploadDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
})

/**
 * Filters uploaded files, accepts only images.
 */
const _fileFilter = (req, file, cb) => {
    
    if (file.mimetype.startsWith("image/")) cb(null, true)
	else cb(new AppError(400, "Only image files are allowed."), false)
}

/**
 * Multer instance with configurations.
 */
const upload = multer({ storage: _storage, fileFilter: _fileFilter })



module.exports = { upload }