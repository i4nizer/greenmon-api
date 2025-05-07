const { predict } = require('../utils/detection.util')
const { Log, Alert, Detection, Output, Sensor, MCU, Greenhouse } = require('../models/index.model')

//

/**
 * This performs lettuce NPK detection on the given image.
 * This also creates an alert if the detection founds NPK deficiency.
 * 
 * @param {{
 *  id: number,
 *  icon: string,
 *  name: string,
 *  unit: string,
 *  path: string
 *  outputId: number
 * }} image The image object created after insertion to database.
 */
const createImageDetection = async (image) => {
    const bboxes = await predict(image.path)
    const promises = []

    const output = await Output.findByPk(image.outputId, { attributes: ['sensorId'] })
    const sensor = await Sensor.findByPk(output.sensorId, { attributes: ['mcuId'] })
    const mcu = await MCU.findByPk(sensor.mcuId, { attributes: ['greenhouseId'] })
    const greenhouse = await Greenhouse.findByPk(mcu.greenhouseId, { attributes: ['userId'] })

    for (const bbox of bboxes) {
        const { box, class: label, confidence } = bbox
        const { x, y, w, h } = box

        const detection = Detection.create({
            class: label,
            confidence,
            x, y, width: w, height: h,
            imageId: image.id,
        })

        promises.push(detection)

        if (label == 'Healthy') {
            const log = Log.create({
				title: "NPK Detection",
                message: `Healthy lettuce detected on ${image.name}, ${image.path}.`,
                greenhouseId: mcu.greenhouseId,
            })

            promises.push(log)
        }
        else {
            const alert = Alert.create({
                title: "NPK Detection",
                message: `${label} lettuce detected on ${image.name}, ${image.path}.`,
                severity: "Error",
                viewed: false,
                emailed: false,
                greenhouseId: mcu.greenhouseId,
                userId: greenhouse.userId,
            })

            promises.push(alert)
        }
    }

    await Promise.all(promises)
}

//

module.exports = {
    createImageDetection,
}