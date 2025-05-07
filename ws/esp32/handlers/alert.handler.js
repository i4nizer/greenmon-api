const { Alert } = require("../../../models/index.model")
const { sendWsEsp32 } = require("../util.ws")



/**
 * Inserts a new record.
 * 
 * @param {WebSocket} ws The web socket of esp32.
 * @param {Array} data The alerts sent by esp32.
 */
const onCreateAlert = async (ws, data) => {
    await Alert.bulkCreate(data, { individualHooks: true, source: "esp32" })
}



module.exports = {
    onCreateAlert,
}