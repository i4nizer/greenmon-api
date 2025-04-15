const { Reading } = require("../../../models/index.model")



/**
 * Inserts a new record.
 * 
 * @param {WebSocket} ws The web socket of esp32.
 * @param {Array} data The readings sent by esp32.
 */
const onCreateReading = async (ws, data) => {
	await Reading.bulkCreate(data)
}



module.exports = {
    onCreateReading,
}