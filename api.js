const express = require('express');

const env = require('./configs/env.config')
const { sequelize } = require("./models/index.model")

const { logger } = require('./utils/logger.util')

const routes = require("./routes/router")


/**
 * Initalize app, parser, logger, security, routes, and error handler.
 */
const app = express();
app.use("/", routes);

    
/**
 * Run database and api.
 */;
(async () => {
    try {
        // Attempt connecting to mongodb
        await sequelize.authenticate();
        logger.info("Database connected successfully.");
        
        // Sync models with database
        await sequelize.sync({ alter: true });
        logger.info("Database tables created successfully.");

        // Run api after connecting to database
        const url = `http://localhost:${env.port}`
        app.listen(env.port, '0.0.0.0', () => logger.info(`Api running on ${url}.`))

    } catch (error) {
        
        // whatever happened, log it
        logger.error("Unexpected error occurred during initialization.", error);
        process.exit(0);
    }    
})()