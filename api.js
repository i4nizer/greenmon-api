const express = require('express');
const { bindExpressApp } = require('./ws/index.ws')


const env = require('./configs/env.config')
const { sequelize } = require("./models/index.model")

const { logger } = require('./utils/logger.util')
const { mlLettuceModelLoad } = require('./utils/model.util')

const routes = require("./routes/router");
const { workerInit } = require('./workers/index.worker');


/**
 * Initalize app, parser, logger, security, routes, and error handler.
 */
const app = express();
bindExpressApp(app);
app.use("/", routes);

    
/**
 * Run database and api.
 */;
(async () => {
    try {
        const startTime = Date.now();

        // Attempt connecting to database
        await sequelize.authenticate();
        logger.info("Database connected successfully.");
        
        // Sync models with database
        await sequelize.sync({ alter: true });
        logger.info("Database tables created successfully.");

        // Load model for detection
        await mlLettuceModelLoad()
        logger.info("Lettuce NPK detection model loaded successfully.");
        
        // Wake workers
        await workerInit()
        logger.info("Workers started successfully.");
        
        // Run api after loads
        const url = `http://localhost:${env.port}`
        app.listen(env.port, '0.0.0.0', () => logger.info(`Api running on ${url}.`))

        logger.info(`Api started in ${Date.now() - startTime}ms.`)

    } catch (error) {
        
        // whatever happened, log it
        logger.error(error?.message ?? "Unexpected error occurred during initialization.", error);
        setTimeout(() => process.exit(0), 500)
    }    
})()