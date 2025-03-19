


/**
 * Creates a simplified & generalized sense of error.
 */
class AppError extends Error {

    /**
     * Note that non-operation errors overrides message to 'Something went wrong...'.
     * 
     * @param {Number} status HTTP status code.
     * @param {String} message The specific reason for error.
     * @param {Error} error To save the original error.
     * @param {Boolean} operational False if the error is not expected.
     */
    constructor(status, message, error = null, operational = true) {
        // override message in some cases
        message = !message ? "Something went wrong." : message;
        message = !operational && error ? error.message : message;
        super(message);
        
        this.error = error;
        this.status = status ?? 500;
        this.operational = operational

        Error.captureStackTrace(this, this.constructor)
    }

    /**
     * Change status code in chain.
     * 
     * @param {Number} status HTTP status code.
     * @returns {AppError} This instance.
     */
    code(status) {
        this.status = status;
        return this;
    }
}



module.exports = { AppError }