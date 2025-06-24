const { workerInitAlert } = require("./alert.worker")
const { workerInitUpload } = require("./upload.worker")

//

const workerInit = async () => {
    // initialize all workers
    await workerInitAlert()
    await workerInitUpload()
}

//

module.exports = { workerInit }