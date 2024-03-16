const express = require('express')
const validators = require('../middlewares/validators')
const responses = require('../middlewares/responses')
const requiredFields = require('../constants/requiredFiles')
const {authToken} = require('../middlewares/authentication')
const {getToken} = require('../controllers/auth')

const router = express.Router()

router.post('/getToken', ...validators.validateRequiredFields(requiredFields.login) , getToken)

module.exports = router