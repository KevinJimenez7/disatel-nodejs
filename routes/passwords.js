const express = require('express')
const validators = require('../middlewares/validators')
const requiredFields = require('../constants/requiredFiles')
const {authToken} = require('../middlewares/authentication')
const { createPassword, updatePassword, deletePassword } = require('../controllers/passwords')

const router = express.Router()

router.post('/', authToken, ...validators.validateRequiredFields(requiredFields.createPassword) , createPassword)
router.put('/', authToken, ...validators.validateRequiredFields(requiredFields.updatePassword) , updatePassword)
router.delete('/', authToken, ...validators.validateRequiredFields(requiredFields.deletePassword) , deletePassword)

module.exports = router