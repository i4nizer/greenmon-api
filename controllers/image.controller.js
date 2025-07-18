const fs = require('fs/promises')
const path = require('path')
const fssync = require('fs')
const axios = require("axios")
const cloudinary = require("../configs/cloudinary.config")
const { Op } = require("sequelize")
const { Image, Detection } = require("../models/index.model")
const { Transform, Readable } = require("stream")
const { stringify: csvStringify } = require("csv-stringify")
const env = require("../configs/env.config")

//

/** Get images with paging support (limit, offset) */
const getImage = async (req, res, next) => {
	try {
		const { limit, offset, imageId, cameraId, greenhouseId, year, month, detection, classes } = req.query

		const filter = {
			...(imageId && { id: imageId }),
			...(cameraId && { cameraId }),
			...(greenhouseId && { greenhouseId }),
		}
		if (year && month) {
			const xDate = new Date(year, parseInt(month, 10), 1)
			const yDate = new Date(year, parseInt(month, 10) + 1, 1)
			filter.createdAt = { [Op.between]: [xDate, yDate] }
		}
		const include = detection
			? {
				where: { ...(classes && { class: { [Op.in]: classes?.split(',') } }) },
				model: Detection,
				required: !!classes && !classes?.split(',')?.includes('No Lettuce'),
			  }
			: undefined

		const images = await Image.findAll({
			where: filter,
			include,
			order: [["createdAt", "DESC"]],
			...(limit && { limit: parseInt(limit, 10) }),
			...(offset && { offset: parseInt(offset, 10) }),
		})

		res.json({
			images: detection
				? images.map((img) => {
						const json = img.toJSON()
						json.detections = json.Detections || []
						delete json.Detections
						return json
				  })
				: images,
			count: await Image.count({ where: filter }),
		})
	} catch (error) {
		next(error)
	}
}

/** Responds with a stream of csv file for images. */
const getImageCsv = async (req, res, next) => {
	try {
		const { limit, offset, imageId, cameraId, greenhouseId, year, month, detection } = req.query
		
		const filter = {
			...(imageId && { id: imageId }),
			...(cameraId && { cameraId }),
			...(greenhouseId && { greenhouseId }),
		}
		if (year && month) {
			const xDate = new Date(year, parseInt(month, 10), 1)
			const yDate = new Date(year, parseInt(month, 10) + 1, 1)
			filter.createdAt = { [Op.between]: [xDate, yDate] }
		}
		const include = detection
			? {
					model: Detection,
					required: false,
			  }
			: undefined
		
		const images = await Image.findAll({
			where: filter,
			include,
			order: [["createdAt", "DESC"]],
			...(limit && { limit: parseInt(limit, 10) }),
			...(offset && { offset: parseInt(offset, 10) }),
		})

		res.setHeader("Content-Disposition", 'attachment; filename="images.csv"')
		res.setHeader("Content-Type", "text/csv")

		// Flatten image and detection data for CSV
		const flatten = (batch) =>
			batch.flatMap((img) => {
				const base = {
					id: img.id,
					cameraId: img.cameraId,
					greenhouseId: img.greenhouseId,
					url: img.url,
					imageCreatedAt: img.createdAt ? new Date(img.createdAt).toISOString() : null,
					imageUpdatedAt: img.updatedAt ? new Date(img.updatedAt).toISOString() : null,
				}
				if (detection && img.Detections && img.Detections?.length > 0) {
					return img.Detections.map((det) => ({
						...base,
						detectionId: det.id,
						detectionClass: det.class,
						detectionConfidence: det.confidence,
						detectionX: det.x,
						detectionY: det.y,
						detectionW: det.w,
						detectionH: det.h,
						detectionImageId: det.imageId,
						detectionCreatedAt: det.createdAt ? new Date(det.createdAt).toISOString() : null,
						detectionUpdatedAt: det.updatedAt ? new Date(det.updatedAt).toISOString() : null,
					}))
				} else {
					// If no detection, fill detection columns with null
					return [
						{
							...base,
							detectionId: null,
							detectionClass: null,
							detectionConfidence: null,
							detectionX: null,
							detectionY: null,
							detectionW: null,
							detectionH: null,
							detectionImageId: null,
							detectionCreatedAt: null,
							detectionUpdatedAt: null,
						},
					]
				}
			})

		const transformStream = new Transform({
			objectMode: true,
			transform(chunk, encoding, callback) {
				const flattened = flatten(chunk)
				flattened.forEach((c) => this.push(c))
				callback()
			},
		})

		const columns = [
			"id",
			"cameraId",
			"greenhouseId",
			"url",
			"imageCreatedAt",
			"imageUpdatedAt",
			"detectionId",
			"detectionClass",
			"detectionConfidence",
			"detectionX",
			"detectionY",
			"detectionW",
			"detectionH",
			"detectionImageId",
			"detectionCreatedAt",
			"detectionUpdatedAt",
		]

		const csvStringifier = csvStringify({ header: true, columns })
		const batch = images
		transformStream.write(batch)
		transformStream.end()
		transformStream.pipe(csvStringifier).pipe(res)

	} catch (error) {
		next(error)
	}
}

/** Get image count only */
const getImageCount = async (req, res, next) => {
	try {
		const { limit, offset, imageId, cameraId, greenhouseId, year, month } = req.query

		const filter = {
			...(imageId && { id: imageId }),
			...(cameraId && { cameraId }),
			...(greenhouseId && { greenhouseId }),
		}
		if (year && month) {
			const xDate = new Date(year, parseInt(month, 10), 1)
			const yDate = new Date(year, parseInt(month, 10) + 1, 1)
			filter.createdAt = { [Op.between]: [xDate, yDate] }
		}
		
		const count = await Image.count({
			where: filter,
			order: [["createdAt", "DESC"]],
			...(limit && { limit: parseInt(limit, 10) }),
			...(offset && { offset: parseInt(offset, 10) }),
		})

		res.json({ count })
		
	} catch (error) {
		next(error)
	}
}

const getImageUpload = async (req, res, next) => {
	try {
		const { filename } = req.query
		const filepath = path.resolve(__dirname, `../images/uploads/${filename}.jpg`)
		
		// check local availability
		let cached = true
		await fs.access(filepath).catch(_ => cached = false)

		// serve if available
		if (cached) {
			const imageBuffer = await fs.readFile(filepath)
			res.setHeader("Content-Type", "image/jpeg")
			Readable.from(imageBuffer).pipe(res)
		}
		// else fetch, serve, cache
		else {
			const url = cloudinary.url(`upload/${filename}`, {
				type: "authenticated",
				secure: true,
				sign_url: true,
				resource_type: "image",
			})
	
			const cldres = await axios.get(url, { responseType: "stream" })
			res.setHeader("Content-Type", cldres.headers["content-type"])
			cldres.data.pipe(res)

			const fileStream = fssync.createWriteStream(filepath)
			cldres.data.pipe(fileStream)
			await new Promise((resolve, reject) => {
				fileStream.on('error', err => reject(err))
				fileStream.on('finish', _ => resolve())
			})
		}

	} catch (error) {
		next(error)
	}
}

//

module.exports = {
	getImage,
	getImageCsv,
	getImageCount,
	getImageUpload,
}
