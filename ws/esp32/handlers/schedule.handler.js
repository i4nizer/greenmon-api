const { Schedule } = require("../../../models/index.model")
const { sendWsEsp32 } = require("../util.ws")



/**
 * Updates records.
 * 
 * @param {WebSocket} ws The web socket of esp32.
 * @param {Array} data The data sent by esp32.
 */
const onUpdateSchedule = async (ws, data) => {
    for (const d of data) {
        d.updatedAt = null
        await Schedule.update(d, { where: { id: d.id }, individualHooks: true, source: "esp32" })
    }
}



module.exports = {
    onUpdateSchedule,
}