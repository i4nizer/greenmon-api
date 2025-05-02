const { Op } = require("sequelize")
const { Sensor, Output, Reading } = require("../models/index.model")
const { stringify: csvStringify } = require("csv-stringify")
const { Transform } = require("stream")



/** Responds with an array of readings. */
const getReading = async (req, res, next) => {
	try {
		const { outputId, startdt, enddt, limit } = req.query

		const filter = { ...(outputId && { outputId }) }

		if (startdt && enddt) filter.createdAt = { [Op.gte]: new Date(startdt), [Op.lte]: new Date(enddt) }
		else if (startdt) filter.createdAt = { [Op.gte]: new Date(startdt) }
		else if (enddt) filter.createdAt = { [Op.lte]: new Date(enddt) }

		const readingDocs = await Reading.findAll({
			where: filter,
			order: [["createdAt", "DESC"]],
			...(limit && { limit: parseInt(limit, 10) }),
		})

		res.json({ readings: readingDocs.reverse() })

	} catch (error) {
		next(error)
	}
}

/** Responds with a stream of csv file. */
const getReadingCsv = async (req, res, next) => {
	try {
		const { sensorId, startdt, enddt, limit } = req.query

		const filter = { createdAt: { [Op.ne]: null } }

		if (startdt && enddt) filter.createdAt = { [Op.gte]: new Date(startdt), [Op.lte]: new Date(enddt) }
		else if (startdt) filter.createdAt = { [Op.gte]: new Date(startdt) }
		else if (enddt) filter.createdAt = { [Op.lte]: new Date(enddt) }

		const stream = await Reading.findAllWithStream({
			where: filter,
			include: {
				model: Output,
				where: { sensorId },
				include: {
					model: Sensor,
					where: { id: sensorId },
				},
			},
			order: [["createdAt", "DESC"]],
			...(limit && { limit: parseInt(limit, 10) }),
		})

		res.setHeader("Content-Disposition", 'attachment; filename="readings.csv"')
		res.setHeader("Content-Type", "text/csv")

		const flatten = (batch) =>
			batch.map((chunk) => ({
				id: chunk.id,
				icon: chunk.icon,
				name: chunk.name,
				unit: chunk.unit,
				value: chunk.value,
				createdAt: new Date(chunk.createdAt).toString(),
				updatedAt: new Date(chunk.updatedAt).toString(),
				outputId: chunk.outputId,
				outputName: chunk.Output?.name || null,
				sensorId: chunk.Output?.Sensor?.id || null,
				sensorName: chunk.Output?.Sensor?.name || null,
				sensorLabel: chunk.Output?.Sensor?.label || null,
			}))

		const transformStream = new Transform({
			objectMode: true,
			transform(chunk, encoding, callback) {
				const flattened = flatten(chunk)
				flattened.forEach(c => this.push(c))
				callback()
			},
		})

		const columns = [
			"id",
			"icon",
			"name",
			"unit",
			"value",
			"createdAt",
			"updatedAt",
			"outputId",
			"outputName",
			"sensorId",
			"sensorName",
			"sensorLabel",
		]

		const csvStringifier = csvStringify({ header: true, columns })
		stream.pipe(transformStream).pipe(csvStringifier).pipe(res)

	} catch (error) {
		next(error)
	}
}


module.exports = {
	getReading,
	getReadingCsv,
}
