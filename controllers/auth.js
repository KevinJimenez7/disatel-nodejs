const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const {handleSuccess, handleError} = require('../middlewares/responses')
const {User} = require('../models/users')

require('dotenv').config()

module.exports.getToken = async(req, res, next) => {
    const {email, password} = req.body

    try {
        const user = await User.findOne({
            where: {
                email: email
            }
        })

        if(!user){
            return handleError(
                'Usuario no existe', 
                400, 
                'El correo electrónico que ingresaste no está registrado',
                next
                )
        }

        if(!user.active){
            return handleError(
                'Usuario inactivo', 
                400, 
                'El usuario esta inactivo, contacte al administrador.',
                next
                )
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        if(passwordMatch){
            const token = await jwt.sign({
                username: user.username,
                email: user.email,
                rol: user.rol,
                id: user.userId
            }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.TOKEN_EXPIRES_TIME  || '1h'})

            handleSuccess(
                'Inicio de sesión exitoso',
                {
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    rol: user.rol,
                    token: token,
                    resetPassword: user.resetPassword,
                },
                req, res
            )    
        } else {
            handleError(
                'Contraseña incorrecta',
                400,
                'La contraseña ingresada es incorrecta',
                next
            )
        }

    } catch (error) {
        console.log(error);
        handleError(
            'Error al iniciar sesión',
            500,
            'Ocurrió un error al iniciar sesión, intenta nuevamente',
            next
        )
    }
}