const jwt = require('jsonwebtoken')
require('dotenv').config()

function getTokenData(req){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        return user
    })
}

module.exports = getTokenData