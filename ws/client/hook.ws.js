const { Log, Reading } = require('../../models/index.model')
const { onAfterLogCreate } = require('./hooks/log.hook')
const { onAfterReadingCreate } = require('./hooks/reading.hook')


/**
 * Attaches hooks after the call so that it would be available upon express bind.
 * The hooks are attached to database models.
 */
const attachWsClientHooks = () => {
	
    // Attach log hooks
    Log.afterCreate(onAfterLogCreate)

    // Attach reading hooks
    Reading.afterCreate(onAfterReadingCreate)
}



module.exports = { attachWsClientHooks }