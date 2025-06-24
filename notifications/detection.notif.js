const { Detection, Image, Greenhouse, Alert } = require('../models/index.model')
const { logger } = require('../utils/logger.util')

//

const onAfterDetectionCreate = async (detection, options) => {
    try {
        if (detection?.class == `Healthy`) return

        const image = await Image.findOne({ where: { id: detection?.imageId }, attributes: ['id', 'filename', 'greenhouseId'] })
        const greenhouse = await Greenhouse.findOne({ where: { id: image?.greenhouseId }, attributes: ['id', 'userId'] })

        const title = `${detection?.class} Detected`
        let msg = `A ${detection?.class} deficient lettuce has been detected in the image ${image?.filename}.`
        msg += ` The detection has a confidence of ${detection?.confidence}%.`
        msg += ` Kindly check the image for more details.`

        await Alert.create({
            title: title,
            message: msg,
            severity: "Warning",
            viewed: false,
            emailed: false,
            greenhouseId: greenhouse?.id,
            userId: greenhouse?.userId
        })

    }
    catch (error) {
        logger.error(error?.message, error)
    }
}

/** Binds hooks about creation of NPK deficient detection.*/
const notifInitDetection = async () => {
    Detection.afterCreate(onAfterDetectionCreate)
}

//

module.exports = { notifInitDetection }