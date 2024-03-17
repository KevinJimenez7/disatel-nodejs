const Sequelize = require('sequelize')
const bcrypt = require('bcryptjs')

const {hashPassword} = require('../utils/hashedPassword')
const createUsername = require('../utils/createUsername')
const sequelize = require('../database/config')
const Folder = require('./folders')
require('dotenv').config()

const User = sequelize.define('user', {
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    rol: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'USER'
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    resetPassword: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
})

User.hasMany(Folder, { foreignKey: 'userId' });

async function createAdmin () {
    try{
        const user = await User.findOne({
            where: {
                email: process.env.ADMIN_EMAIL
            }
        })

        if(user) return

        const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD)
        .catch((err) => {
            throw new Error('Error al encriptar la constraseña del usuario administrador', err)
        })

        await User.create({
            email: process.env.ADMIN_EMAIL,
            firstName: process.env.ADMIN_FIRST_NAME,
            lastName: process.env.ADMIN_LAST_NAME,
            username: createUsername(process.env.ADMIN_FIRST_NAME, process.env.ADMIN_LAST_NAME),
            phone: process.env.ADMIN_PHONE,
            rol: 'ADMIN',
            password: hashedPassword,
            resetPassword: false
        })
    } catch (err) {
        console.log('Error al crear usuario administrador', err);
    }
}

module.exports = {User, createAdmin}