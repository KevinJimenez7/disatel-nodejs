const Sequelize = require('sequelize')
require('dotenv').config()

const dbName = process.env.DB_NAME
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASSWORD
const dbHost = process.env.DB_HOST
const dbPort = process.env.DB_PORT

const sequelize = new Sequelize(
    dbName, 
    dbUser,
    dbPass,
    {
        host: dbHost,
        dialect: 'mysql',
        port: dbPort
    }
)

module.exports = sequelize