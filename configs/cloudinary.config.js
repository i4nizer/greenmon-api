const env = require("./env.config")
const cloudinary = require("cloudinary").v2

//

cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: parseInt(env.cloudinaryApiKey, 10),
    api_secret: env.cloudinaryApiSecret,
})

//

module.exports = cloudinary