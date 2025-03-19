const crypto = require('crypto')



/**
 * Uses sha256 algorithm to hash passwords.
 * 
 * @param {String} password The password to hash.
 * @returns {String} The hashed password.
 */
const hash = (password) => {
    
    const checksum = crypto.createHash('sha256')
        .update(password)
        .digest('hex')
    
    return checksum;
}



module.exports = { hash }