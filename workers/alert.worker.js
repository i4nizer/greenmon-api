const { Op } = require('sequelize');
const { craftAlertEmail } = require('../configs/mail.config');
const { Alert, User } = require('../models/index.model');
const { mail } = require('../utils/mail.util');
const { logger } = require('../utils/logger.util');

//

const alertQueue = []
const alertState = { looping: false }

//

const workerInitAlert = async () => {
    // retrieve all unnotified alerts
    const alerts = await Alert.findAll({
        where: { emailed: false },
        attributes: ['id', 'title', 'message', 'severity', 'userId'],
        order: [['createdAt', 'ASC']],
    });

    // queue each alert with metadata
    for (const alert of alerts) {
        alertQueue.push({
            id: alert.dataValues?.id,
            title: alert.dataValues?.title,
            message: alert.dataValues?.message,
            severity: alert.dataValues?.severity,
            userId: alert.dataValues?.userId,
        });
    }

    // listen for new alerts
    Alert.afterCreate(async (alert, options) => {
        alertQueue.push({
            id: alert.dataValues?.id,
            title: alert.dataValues?.title,
            message: alert.dataValues?.message,
            severity: alert.dataValues?.severity,
            userId: alert.dataValues?.userId,
        });
    });

    // now loop it
    setInterval(() => {
        if (alertState.looping || alertQueue.length <= 0) return;
        alertState.looping = true;

        workerLoopAlert()
            .catch((err) => logger.error(err?.message, err))
            .finally(() => alertState.looping = false);
    }, 1000)
}

const workerLoopAlert = async () => {

    // process each alert in the queue
    for (let i = 0; i < alertQueue.length; i++) {

        // get user email
        const user = await User.findOne({
            where: { id: alertQueue.at(i)?.userId },
            attributes: ["name", "email"]
        })
        if (!user) continue;

        // craft email content
        const { subject, text } = craftAlertEmail(
            user?.name,
            alertQueue.at(i)?.title,
            alertQueue.at(i)?.message,
            alertQueue.at(i)?.severity
        )

        // send email notification
        await mail(user?.email, subject, text)
            .then(() => logger.info(`Worker alert email sent to ${user?.email}.`))
            .catch(err => logger.error(err?.message, err))
        
            
        // update alert as emailed
        await Alert.update({ emailed: true }, { where: { id: alertQueue.at(i)?.id } })
            .catch(err => logger.error(err?.message, err));
        
        // remove alert from queue
        alertQueue.splice(i, 1);
        i--;

        // delay to avoid overwhelming the email service
        await new Promise(res => setTimeout(() => res(), 100));
    }
};

//

module.exports = { workerInitAlert };