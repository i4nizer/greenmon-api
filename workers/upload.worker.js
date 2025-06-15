const fs = require('fs/promises')
const path = require('path')
const cloudinary = require("../configs/cloudinary.config")
const { Image } = require('../models/index.model')
const { Readable } = require('stream')
const { Op } = require('sequelize')

//

const uploadDir = "./images/uploads"
const uploadQueue = []
const uploadState = { looping: false }

//

// helper to check filepath
const hasAccess = async (filepath) => {
    let accessible = false
    await fs.access(filepath)
        .then(_ => accessible = true)
        .catch(_ => accessible = false)
    return accessible
}

// helper to request cloudinary stream
const getStream = async (filename) => new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
        {
            type: "authenticated",
            folder: "upload",
            public_id: filename,
            resource_type: "image",
        },
        (error, result) => (!!error ? reject(error) : resolve(result))
    )
})

//

const workerInitUpload = async () => {
    // retrieve all unuploaded images
    const images = await Image.findAll({
        where: { uploadedAt: null },
        attributes: ['id', 'filename'],
        order: [['createdAt', 'ASC']],
    })

    const missingFileImages = []
    const existingFileImages = []
    
    // remove non-existing files
    for (const img of images) {
        const filepath = path.resolve(__dirname, uploadDir, `${img.dataValues?.filename}.jpg`)
        if (await hasAccess(filepath)) existingFileImages.push(img)
        else missingFileImages.push(img)
    }
    await Image.destroy({ where: { id: { [Op.in]: missingFileImages.map(i => i.dataValues?.id) } } })

    // queue each images with metadata
    for (const img of existingFileImages) {
        uploadQueue.push({
            id: img.dataValues?.id,
            filename: img.dataValues?.filename,
            uploaded: false,
            uploading: false,
        })
    }

    // listen on image save on database to queue it (pressumed images are saved in files)
    Image.afterCreate(async (image, options) => {
        uploadQueue.push({
            id: image.dataValues?.id,
            filename: image.dataValues?.filename,
            uploaded: false,
            uploading: false,
        })
    })

    // now loop it
    setInterval(() => workerLoopUpload(), 1000)
}

const workerLoopUpload = async () => {
    if (uploadState.looping) return
    uploadState.looping = true

    // helper function to execute on each queue
    const uploadImage = async (queue) => {
        const filepath = path.resolve(__dirname, uploadDir, `${queue.filename}.jpg`)
        const imageBuffer = await fs.readFile(filepath)
        const stream = await getStream(queue.filename)

        Readable.from(imageBuffer).pipe(stream)

        await new Promise((resolve, reject) => {
            stream.on('finish', () => resolve(stream))
            stream.on('error', (error) => reject(error))
        })
    }

    // gather all of the promises
    const uploadPromises = []
    for (const queue of uploadQueue) {
        if (queue?.uploading) continue
        queue.uploading = true
        
        uploadPromises.push(
            uploadImage(queue)
                .then(_ => queue.uploaded = true)
                .catch(_ => queue.uploaded = false)
                .finally(_ => queue.uploading = false)
        )
    }

    // wait for all the promises to resolve
    await Promise.all(uploadPromises)

    // gather and remove successfully uploaded images
    const uploadedIds = []
    for (const queue of uploadQueue) {
        if (!queue?.uploaded) continue
        uploadedIds.push(queue?.id)
        
        const index = uploadQueue.indexOf(queue)
        if (index == -1) continue
        
        uploadQueue.splice(index, 1)
    }

    // update uploaded images
    await Image.update(
        { uploadedAt: Date.now() },
        { where: { id: { [Op.in]: uploadedIds } } }
    )

    // end loop for next
    uploadState.looping = false
}

//

module.exports = { workerInitUpload }