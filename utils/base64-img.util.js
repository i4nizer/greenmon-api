const base64Img = require("base64-img")



/** 
 * Saves a base64 image to a file.
 */
const saveBase64Img = async (base64, path, filename) => new Promise((res, rej) => {
    const callback = (err, filepath) => !!err ? rej(err) : res(filepath)
    base64Img.img(base64, path, filename, callback)
})



module.exports = {
    saveBase64Img,
}