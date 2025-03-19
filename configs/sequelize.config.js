const env = require('./env.config');
const { Sequelize } = require('sequelize');



/**
 * A Sequelize instance for MySQL connection.
 */
const sequelize = new Sequelize(env.dbName, env.dbUser, env.dbPassword, {
    host: env.dbHost,
    port: env.dbPort,
    dialect: env.dbDialect,
    logging: false,
});



module.exports = sequelize;