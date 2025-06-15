const { workerInitUpload } = require("./upload.worker")

//

const workerInit = async () => {
    // initialize all workers
    await workerInitUpload()
}

//

module.exports = { workerInit }