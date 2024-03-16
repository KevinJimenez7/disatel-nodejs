const {check, validationResult} = require('express-validator')
const {handleError} = require('./responses')

const validateRequiredFields = (requiredFields) => [
    ...Object.keys(requiredFields).map((field) => {
        return check(field).not().isEmpty().withMessage(requiredFields[field])
    }),

    (req, res, next) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            handleError('Ingrese los campos requeridos', 400, errors.array().map(err => err.msg).join(', '), next)
        }
        next()
    }
]

module.exports = {validateRequiredFields}