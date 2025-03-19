const morgan = require("morgan")
const { logger } = require("../utils/logger.util")



/**
 * Make morgan use the winston logger.
 */
const _morganStream = {
    write: (message) => logger.info(message.trim()),
}

/**
 * Logs all incoming requests.
 */
const loggerMiddleware = morgan(
    ":method :url :status :response-time ms - :res[content-length]",
    { stream: _morganStream }
)



module.exports = { loggerMiddleware }