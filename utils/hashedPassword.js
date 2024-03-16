const bcrypt = require('bcrypt')

async function hashPassword (pasword){
    try {
        const hashedPassword = await bcrypt.hash(pasword, 10)
        return hashedPassword
    } catch (error) {
        throw new Error(error) 
    }
}

module.exports = {hashPassword}