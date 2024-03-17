const Sequelize = require('sequelize')
const sequelize = require('../database/config')
const {User} = require('./users');
const Password = require('./passwords')

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
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User, // Utiliza User como una propiedad del objeto importado
            key: 'userId'
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

Folder.hasMany(Password, { foreignKey: 'folderId' });

module.exports = Folder
