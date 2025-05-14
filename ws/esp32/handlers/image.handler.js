const fs = require("fs/promises")
const path = require("path")
const { Image } = require("../../../models/index.model")
const { saveBase64Img } = require("../../../utils/base64-img.util")
const { WebSocketClient } = require("../../wsclient.ws")

//

/**
 * Creates records.
 *
 * @param {WebSocketClient} wsClient The web socket instance of esp32.
 * @param {Array} data The actions sent by esp32.
 */
const onCreateImage = async (wsClient, data) => {
    for (const d of data) {
        
        // path=filename : already randomized/unique
        d.completed = false
        await Image.create(d, { source: "esp32" })
    }
}

/**
 * Appends base64 image chunks to its corresponding file.
 *
 * @param {WebSocketClient} wsClient The web socket instance of esp32.
 * @param {Array} data The actions sent by esp32.
 */
const onCreateImageChunk = async (wsClient, data) => {
    for (const d of data) {

        // { filename: '', chunk: 'base64str' }
        const filepath = path.resolve(__dirname, `../../../images/uploads/${d?.filename}`)
        await fs.appendFile(filepath, d?.chunk)
    }
}

/**
 * Updates the image via filename as completed.
 *
 * @param {WebSocketClient} wsClient The web socket instance of esp32.
 * @param {Array} data The actions sent by esp32.
 */
const onUpdateImage = async (wsClient, data) => {
    for (const d of data) {

        // { filename: "filename", completed: true }
        const image = await Image.findOne({ where: { filename: d?.filename } })
        const filedir = path.resolve(__dirname, `../../../images/uploads`)
        const filename = d?.filename
        const filepath = `${filedir}/${filename}`
        
        // incomplete means data has damage
        if (!d?.completed) {
            await fs.rm(filepath)
            await image.destroy()
            continue;
        }

        let exists = true;
        await fs.access(filepath).catch(() => exists = false)
        if (!exists) continue;

        // convert into base64->jpeg
        const base64Buffer = await fs.readFile(filepath)
        const base64str = base64Buffer.toString()
        const base64img = Buffer.from(base64str, "base64")

        const newFilename = `${new Date().toISOString().replace(/:/g, "-")}-${filename}.jpg`
        await fs.writeFile(`${filedir}/${newFilename}`, base64img)
        await fs.rm(filepath)

        // update the image tuple's filename
        await image.update({ filename: newFilename, completed: true }, { source: "esp32" })
    }
}

//

module.exports = {
    onCreateImage,
    onCreateImageChunk,
    onUpdateImage,
}
