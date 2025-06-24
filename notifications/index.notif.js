const { notifInitLog } = require('./log.notif')
const { notifInitStatus } = require('./status.notif')
const { notifInitDetection } = require('./detection.notif')

//

/** Initializes notification related bindings. */
const notifInit = async () => {
    await notifInitLog()
    await notifInitStatus()
    await notifInitDetection()
}

//

module.exports = { notifInit }