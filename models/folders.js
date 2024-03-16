const Sequelize = require('sequelize')

const sequelize = require('../database/config')
const {User} = require('./users')

const Folder = sequelize.define('folders', {
    folderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    userEmail: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
            model: User,
            key: 'email'
        }
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
},{
    timestamps: false
})

module.exports = Folder