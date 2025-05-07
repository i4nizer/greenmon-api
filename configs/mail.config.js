


/**
 * Craft an email message dedicated for the unexpected errors to the developer.
 * 
 * @param {Error} error The error that occurred.
 */
const craftUnexpectedErrorMail = (error) => {
    let subject = "Unexpected Error Occurred - Greenmon"

    let text = "Dear Developer,\n"
    text += "We encountered an unexpected error in the "
    text += "Greenmon system that requires immediate attention. "
    
    text += "Below are the details: \n"
    text += `Error Name: ${error.name}\n`
    text += `Error Cause: ${error.cause}\n`
    text += `Error Message: ${error.message}\n`
    text += `Error Stack: ${error.stack}\n`
    
    text += "Please investigate this issue as soon as possible "
    text += "and let us know if you need further details.\n"
    text += "Best regards,\n"
    text += "Greenmon Team\n"

    return { subject, text }
}


/**
 * Craft an email message with otp for reset password.
 * 
 * @param {String} name The name of the recipient.
 * @param {Number} otp The otp to be sent.
 */
const craftPasswordResetMail = (name, otp) => {
	let subject = "Reset Your Password - Greenmon"

	let text = `Dear ${name},\n`
	text += "We received a request to reset your password. "
	text += "Please use the following One-Time Password (OTP) to proceed: "
	text += `\n[${otp.toString().padStart(6, '0')}]\n`
	text += "This OTP is valid for 15 minutes and "
	text += "should not be shared with anyone for security reasons. "
	text += "If you did not request this, please ignore this email. "
	text += "For any assistance, feel free to contact our support team."
	text += "\n\nBest regards,\nThe Greenmon Team"

	return { subject, text }
}

/**
 * Craft an email message for successful password reset.
 * 
 * @param {String} name The name of the recipient.
 */
const craftPasswordResetedMail = (name) => {
	let subject = "Your Greenmon Password Has Been Reset"

	let text = `Dear ${name},\n`
	text += "Your password has been successfully reset. "
	text += "If you did not perform this action, "
	text += "please contact our support team immediately. "
	text += "For your security, we recommend changing your password regularly."
	text += "\n\nBest regards,\nThe Greenmon Team"

	return { subject, text }
}

/**
 * Craft an email message for successful account verification.
 * 
 * @param {String} name The name of the recipient.
 * @param {Number} otp The otp to be sent.
 */
const craftAccountConfirmedMail = (name) => {
	let subject = "Your Greenmon Account Has Been Confirmed"

	let text = `Dear ${name},\n`
	text += "Congratulations! Your Greenmon account "
    text += "has been successfully verified. "
	text += "You can now log in and start using our platform."
	text += "\n\nIf you have any questions, "
	text += "feel free to contact our support team."
	text += "\n\nBest regards,\nThe Greenmon Team"

	return { subject, text }
}

/**
 * Craft an email message with otp for account confirmation.
 * 
 * @param {String} name The name of the recipient.
 * @param {Number} otp The otp to be sent.
 */
const craftAccountConfirmationMail = (name, otp) => {
    let subject = "Your One-Time Password (OTP) "
    subject += "for Greenmon Account Verification";
    
    let text = `Dear ${name}`
    text += "\nThank you for signing up on Greenmon! "
    text += "To complete your account verification, "
    text += "please use the following One - Time Password(OTP): "
    text += `\n[${otp.toString().padStart(6, '0')}]`
    text += "\nThis OTP is valid for 15 minutes and "
    text += "should not be shared with anyone for security reasons. "
    text += "If you did not request this, please ignore this email. "
    text += "For any assistance, feel free to contact our support team."
    text += "\nBest regards,\nThe Greenmon Team"

    return { subject, text }
}



/**
 * Craft an email message to notify successful sign in.
 * 
 * @param {String} name The name of the recipient.
 * @param {Date} datetime Defaults to now.
 */
const craftSuccessfulSignInMail = (name, datetime = new Date()) => {
    let subject = "Sign-In Alert - Greenmon"

    let text = `Hi ${name}\n`
    text += "We noticed a successful sign-in to your Greenmon account.\n"
    text += `Datetime: ${datetime.toString()}\n`
    text += "If this was you, no further action is needed. "
    text += "If you didn’t sign in, please reset your password immediately.\n"
    text += "Stay secure,\n"
    text += "The Greenmon Team"

    return { subject, text }
}

/**
 * Craft an email message to notify failed sign in attempt.
 * 
 * @param {String} name The name of the recipient.
 * @param {Date} datetime Defaults to now.
 */
const craftFailedSignInMail = (name, datetime = new Date()) => {
    let subject = "Unsuccessful Sign-In Attempt - Greenmon"

    let text = `Hi ${name}\n`
    text += "We noticed a failed sign-in attempt to your Greenmon account.\n"
    text += `Datetime: ${datetime.toString()}\n`
    text += "If this was you, please check that you entered the correct password. "
    text += "If you forgot your password, you can reset it.\n"
    text += "If this wasn’t you, we recommend updating your password\n"
    text += "Stay safe,\n"
    text += "The Greenmon Team"

    return { subject, text }
}

/**
 * Craft an email message to notify successful sign out.
 * 
 * @param {String} name The name of the recipient.
 * @param {Date} datetime Defaults to now.
 */
const craftSuccessfulSignOutMail = (name, datetime = new Date()) => {
    let subject = "Sign-Out Alert - Greenmon"

    let text = `Hi ${name}\n`
    text += "You have successfully signed out of your Greenmon account.\n"
    text += `Datetime: ${datetime.toString()}\n`
    text += "If this wasn’t you, please sign in and update your security settings.\n"
    text += "Need help? Contact our support team.\n"
    text += "Best,\n"
    text += "The Greenmon Team"

    return { subject, text }
}



/**
 * Craft an email message to notify a user about an alert.
 * 
 * @param {String} name The name of the recipient.
 * @param {String} title The alert title.
 * @param {String} message The alert message.
 * @param {String} severity The severity level (Info, Success, Warning, Error).
 */
const craftAlertEmail = (name, title, message, severity = "Info") => {
    let subject = `Alert - ${severity} - Greenmon`

    let text = `Hi ${name},\n`
    text += "You have a new alert from your Greenmon system.\n\n"
    text += `Title: ${title}\n`
    text += `Message: ${message}\n`
    text += `Severity: ${severity}\n\n`
    text += "Please check your dashboard for more details.\n"
    text += "Need help? Contact our support team.\n"
    text += "Best,\n"
    text += "The Greenmon Team"

    return { subject, text }
}



module.exports = {
    craftUnexpectedErrorMail,
    craftAccountConfirmationMail,
    craftAccountConfirmedMail,
    craftPasswordResetMail,
    craftPasswordResetedMail,

    craftSuccessfulSignInMail,
    craftFailedSignInMail,
    craftSuccessfulSignOutMail,

    craftAlertEmail,
}