const {handleSuccess, handleError} = require('../middlewares/responses')
const {User} = require('../models/users')
const createUsername = require('../utils/createUsername')
const getTokenData = require('../utils/getTokenData')
const {hashPassword} = require('../utils/hashedPassword')

module.exports.createUser = async(req, res, next) => {
    const {firstName, lastName, email, phone, rol} = req.body

    try {
        const user = await User.findOne({
            where: {
                email: email
            }
        })

        if(user){
            return handleError(
                'Usuario existente', 
                400, 
                'El correo electrónico que ingresaste ya está registrado',
                next
                )
        }

        const username = createUsername(firstName, lastName)
        const temporalPassword = (await hashPassword(username)).slice(0, 10);
        const hashedPassword = await hashPassword(temporalPassword)
        .catch((err) => {
            throw new Error('Error al encriptar la constraseña del usuario', err)
        })

        await User.create({
            email: email,
            fullName: `${firstName} ${lastName}`,
            username: username,
            phone: phone,
            password: hashedPassword,
        })
        .then(() => {
            handleSuccess(
                'Usuario creado correctamente', 
                {
                    username: username,
                    temporalPassword: temporalPassword
                },
                req, res
            )
        })

    } catch (error) {
        console.log(error);
        handleError(
            'Error al crear Usuario',
            500,
            'Ocurrió un error al crear Usuario, intenta nuevamente',
            next
        )
    }
}

module.exports.changePassword = async(req, res, next) => {
    const {password} = req.body
    const userData = getTokenData(req)
    try {
        const user = await User.findOne({
            where: {
                email: userData.email
            }
        })

        if(!user){
            return handleError(
                'Usuario no existente', 
                400, 
                'El correo electrónico que ingresaste no está registrado',
                next
                )
        }

        const hashedPassword = await hashPassword(password)

        await user.update({password: hashedPassword, resetPassword: false})
        .then(() => {
            return handleSuccess(
                'Contraseña actualizada exitosamente',
                null,
                req, res
            )
        })

    } catch (error) {
        console.log(error);
        handleError(
            'Error al actualizar la contraseña',
            500,
            'Ocurrió un error al actualizar la contraseña, intenta nuevamente',
            next
        )
    }

}

module.exports.resetPassword = async(req, res, next) => {
    const {email} = req.body
    const {rol} = getTokenData(req)

    if(rol === 'USER'){
        handleError(
            'No tienes permisos correspondientes',
            401,
            'El usuario no cuenta con los permisos necesarios para realizar esta acción',
            next
        )
    }

    try {
        const user = await User.findOne({
            where: {
                email: email
            }
        })

        if(!user){
            return handleError(
                'Usuario no existente', 
                400, 
                'El correo electrónico que ingresaste no está registrado',
                next
                )
        }

        const temporalPassword = (await hashPassword(email)).slice(0, 10);
        const hashedPassword = await hashPassword(temporalPassword)

        await user.update({password: hashedPassword, resetPassword: true})
        .then(() => {
            return handleSuccess(
                'Contraseña reiniciada exitosamente',
                {
                    email: email,
                    temporalPassword: temporalPassword
                },
                req, res
            )
        })

    } catch (error) {
        console.log(error);
        handleError(
            'Error al reiniciar la contraseña',
            500,
            'Ocurrió un error al reiniciar la contraseña, intenta nuevamente',
            next
        )
    }

}