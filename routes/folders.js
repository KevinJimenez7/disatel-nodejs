const express = require('express')
const validators = require('../middlewares/validators')
const requiredFields = require('../constants/requiredFiles')
const {authToken} = require('../middlewares/authentication')
const { createFolder, updateFolder, activateFolder, getCredentials } = require('../controllers/folders')

const router = express.Router()

router.get('/', authToken, getCredentials)
router.post('/', authToken, ...validators.validateRequiredFields(requiredFields.createFolder) , createFolder)
router.put('/', authToken, ...validators.validateRequiredFields(requiredFields.updateFolder) , updateFolder)
router.patch('/', authToken, ...validators.validateRequiredFields(requiredFields.activateFolder) , activateFolder)

module.exports = router