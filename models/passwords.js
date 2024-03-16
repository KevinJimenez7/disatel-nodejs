const Sequelize = require('sequelize')

const sequelize = require('../database/config')
const Folder = require('./folders')

const Password = sequelize.define('passwords', {
    passwordId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    url: {
        type: Sequelize.STRING,
        allowNull: false
    },
    folderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Folder,
            key: 'folderId'
        }
    },
},{
    timestamps: false
})

module.exports = Password