const { Reading } = require("../../../models/index.model")
const { sendWsEsp32 } = require("../util.ws")



/**
 * Inserts a new record.
 * 
 * @param {WebSocket} ws The web socket of esp32.
 * @param {Array} data The readings sent by esp32.
 */
const onCreateReading = async (ws, data) => {
    await Reading.bulkCreate(data, { individualHooks: true, source: "esp32" })
}



module.exports = {
    onCreateReading,
}