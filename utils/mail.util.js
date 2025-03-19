const env = require('../configs/env.config')
const nodemailer = require('nodemailer')
const SMTPTransport = require('nodemailer/lib/smtp-transport')
const { AppError } = require('./app-error.util')



/** Transporter settings uses api email. */
const _transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: env.apiEmail,
        pass: env.apiEmailPassword,
    }
})

/**
 * Converts callback to promise that resolves to success.
 * 
 * @param {String} to Email address of the recipient.
 * @param {String} subject Brief topic of the message.
 * @param {String} text The message to be sent.
 * @returns {Promise<SMTPTransport.SentMessageInfo>} The details about the sent message.
 */
const mail = (to, subject, text) => new Promise((res, rej) => {
    // craft mail
    const mailOptions = { from: env.apiEmail, to, subject, text, }

    // create callback
    const cb = (err, info) => {
        // has error
        if (err) {
            // invalid address
            if (err.responseCode === 550 && err.message.includes('User unknown')) {
                return rej(new AppError(400, "Email address does not exists.", err))
            }
            return rej(new AppError(500, "", err, false))
        }
        res(info)
    }

    // send email
    _transporter.sendMail(mailOptions, cb);
})



module.exports = { mail }