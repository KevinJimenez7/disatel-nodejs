const jwt = require('jsonwebtoken')
require('dotenv').config()

const {handleError} = require('./responses')

function authToken (req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(!token){
        return handleError('No autenticado', 401, 'No estás autenticado', next)
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err){
            return handleError('Token inválido', 403, 'El token es inválido', next)
        }

        req.user = user
        console.log(user);
        
        next()
    })
}

module.exports = {authToken}