const express = require('express')
const validators = require('../middlewares/validators')
const requiredFields = require('../constants/requiredFiles')
const {authToken} = require('../middlewares/authentication')
const {createUser, changePassword, resetPassword} = require('../controllers/users')

const router = express.Router()

router.post('/create', authToken, ...validators.validateRequiredFields(requiredFields.createUser) , createUser)
router.post('/changePassword', authToken, ...validators.validateRequiredFields(requiredFields.changePassword) , changePassword)
router.post('/resetPassword', authToken, ...validators.validateRequiredFields(requiredFields.resetPassword) , resetPassword)

module.exports = router