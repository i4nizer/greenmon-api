const { Detection, Image } = require("../models/index.model")

//

/** Get detections with paging support (limit, offset) */
const getDetection = async (req, res, next) => {
	try {
		const { limit, offset, detectionId, imageId, class: className, image, greenhouseId } = req.query

		const filter = {
			...(detectionId && { id: detectionId }),
			...(imageId && { imageId }),
			...(className && { class: className }),
		}

		const include = image ? {
			where: { ...(greenhouseId && { greenhouseId }) },
			model: Image,
			required: false,
		} : undefined

		const detections = await Detection.findAll({
			where: filter,
			include,
			order: [["createdAt", "DESC"]],
			...(limit && { limit: parseInt(limit, 10) }),
			...(offset && { offset: parseInt(offset, 10) }),
		})
		
		res.json({
			detections: image ? detections.map(d => {
				const detect = d.toJSON()
				detect.images = detect.Images
				delete detect.Images
				return detect
			}) : detections,
			count: await Detection.count({ where: filter })
		})
        
	} catch (error) {
		next(error)
	}
}

/**
 * Responds with a stream of csv file for detections (with image info if requested).
 */
const getDetectionCsv = async (req, res, next) => {
    try {
        const { limit, offset, detectionId, imageId, class: className, image, greenhouseId } = req.query;
        const { stringify: csvStringify } = require("csv-stringify");
        const { Transform } = require("stream");
        
		const filter = {
			...(detectionId && { id: detectionId }),
			...(imageId && { imageId }),
			...(className && { class: className }),
		}
        
		const include = image ? {
            where: { ...(greenhouseId && { greenhouseId }) },
            model: Image,
            required: false,
        } : undefined;
        
		const detections = await Detection.findAll({
            where: filter,
            include,
            order: [["createdAt", "DESC"]],
            ...(limit && { limit: parseInt(limit, 10) }),
            ...(offset && { offset: parseInt(offset, 10) }),
        });
        
		res.setHeader("Content-Disposition", 'attachment; filename="detections.csv"');
        res.setHeader("Content-Type", "text/csv");
        // Flatten detection and image data for CSV
        const flatten = (batch) => batch.map((det) => {
            const base = {
                id: det.id,
                class: det.class,
                confidence: det.confidence,
                x: det.x,
                y: det.y,
                w: det.w,
                h: det.h,
                imageId: det.imageId,
                createdAt: det.createdAt ? new Date(det.createdAt).toISOString() : null,
                updatedAt: det.updatedAt ? new Date(det.updatedAt).toISOString() : null,
            };
            if (image && det.Images && det.Images.length > 0) {
                // If detection has related images, flatten each image
                return det.Images.map(img => ({
                    ...base,
                    cameraId: img.cameraId,
                    greenhouseId: img.greenhouseId,
                    url: img.url,
                    imageCreatedAt: img.createdAt ? new Date(img.createdAt).toISOString() : null,
                    imageUpdatedAt: img.updatedAt ? new Date(img.updatedAt).toISOString() : null,
                }));
            } else {
                // No image info or not requested
                return [base];
            }
		}).flat();
		
		const transformStream = new Transform({
			objectMode: true,
			transform(chunk, encoding, callback) {
				const flattened = flatten(chunk)
				flattened.forEach((c) => this.push(c))
				callback()
			},
		})

        // CSV columns: prioritize detection, then image if requested
        const columns = [
            "id",
            "class",
            "confidence",
            "x",
            "y",
            "w",
            "h",
            "imageId",
            "createdAt",
            "updatedAt",
        ];
        if (image) {
            columns.push(
                "cameraId",
                "greenhouseId",
                "url",
                "imageCreatedAt",
                "imageUpdatedAt"
            );
        }
        const csvStringifier = csvStringify({ header: true, columns });
        const batch = detections;
        transformStream.write(batch);
        transformStream.end();
		transformStream.pipe(csvStringifier).pipe(res);
		
    } catch (error) {
        next(error);
    }
}

/** Get detection count only. */
const getDetectionCount = async (req, res, next) => {
	try {
		const { limit, offset, detectionId, imageId, class: className } = req.query

		const filter = {
			...(detectionId && { id: detectionId }),
			...(imageId && { imageId }),
			...(className && { class: className }),
		}

		const count = await Detection.count({
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

//

module.exports = {
	getDetection,
    getDetectionCsv,
    getDetectionCount,
}
