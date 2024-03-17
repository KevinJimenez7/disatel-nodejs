const express = require('express')
const validators = require('../middlewares/validators')
const requiredFields = require('../constants/requiredFiles')
const {authToken} = require('../middlewares/authentication')
const {createUser, changePassword, resetPassword, activateUser, editUser, getUsers} = require('../controllers/users')

const router = express.Router()

router.post('/create', authToken, ...validators.validateRequiredFields(requiredFields.createUser) , createUser)
router.post('/changePassword', authToken, ...validators.validateRequiredFields(requiredFields.changePassword) , changePassword)
router.post('/resetPassword', authToken, ...validators.validateRequiredFields(requiredFields.resetPassword) , resetPassword)
router.post('/activation', authToken, ...validators.validateRequiredFields(requiredFields.activateUser) , activateUser)
router.put('/', authToken, ...validators.validateRequiredFields(requiredFields.editUser) , editUser)
router.get('/', authToken, getUsers)

module.exports = router