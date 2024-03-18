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
            firstName: firstName,
            lastName: lastName,
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

module.exports.editUser = async(req, res, next) => {
    const {firstName, lastName, email, phone, id} = req.body
    const {rol} = getTokenData(req)

    if(rol === 'USER'){
        return handleError(
            'No tienes permisos correspondientes',
            400,
            'El usuario no cuenta con los permisos necesarios para realizar esta acción',
            next
        )
    }

    try {
        const user = await User.findOne({
            where: {
                userId: id
            }
        })

        if(!user){
            return handleError(
                'Usuario no existente', 
                400, 
                'El usuario no fue encotrado en base de datos',
                next
                )
        }

        const userEmail = await User.findOne({
            where: {
                email: email
            }
        })

        if(userEmail && userEmail.userId !== id){
            return handleError(
                'Correo electrónico no disponible',
                400,
                'El nuevo correo electrónico ya está ocupado por otro usuario'
            )
        }

        const username = createUsername(firstName, lastName)
        let observaciones = []
         
        if(username !== user.username) observaciones.push('El nombre de usuario cambió a consecuencia del cambio de nombre y apellido')
        if(user.email !== email) observaciones.push('El correo electrónico cambió, tómalo en cuenta en el próximo inicio de sesión')

        await user.update({
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            phone: phone
        })
        .then(() => {
            return handleSuccess(
                'Usuario actualizado exitosamente',
                {
                    username: username,
                    name: `${firstName.trim()} ${lastName.trim()}`,
                    email: email,
                    phone: phone,
                    observations: observaciones
                },
                req, res
            )
        })


    } catch (error) {
        console.log(error);
        handleError(
            'Error al editar usuario',
            500,
            'Ocurrió un error al editar el usuario, intenta nuevamente',
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
    const {id} = req.body
    const {rol} = getTokenData(req)

    if(rol === 'USER'){
        handleError(
            'No tienes permisos correspondientes',
            400,
            'El usuario no cuenta con los permisos necesarios para realizar esta acción',
            next
        )
    }

    try {
        const user = await User.findOne({
            where: {
                userId: id
            }
        })

        if(!user){
            return handleError(
                'Usuario no existente', 
                400, 
                'El usuario no se encontró en base de datos',
                next
                )
        }

        const temporalPassword = (await hashPassword(user.email)).slice(0, 10);
        const hashedPassword = await hashPassword(temporalPassword)

        await user.update({password: hashedPassword, resetPassword: true})
        .then(() => {
            return handleSuccess(
                'Contraseña reiniciada exitosamente',
                {
                    email: user.email,
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

module.exports.activateUser = async(req, res, next) => {
    const {id} = req.body
    const {rol} = getTokenData(req)

    if(rol === 'USER'){
        handleError(
            'No tienes permisos correspondientes',
            400,
            'El usuario no cuenta con los permisos necesarios para realizar esta acción',
            next
        )
    }

    try {
        const user = await User.findOne({
            where: {
                userId: id
            }
        })

        if(!user){
            return handleError(
                'Usuario no existente', 
                400, 
                'El usuario no está registrado',
                next
                )
        }

        let activate = !user.active

        await user.update({active: activate})
        .then(() => {
            return handleSuccess(
                `Usuario ${activate ? 'activado' : 'desactivado'} correctamente`,
                null,
                req, res
            )
        })

    } catch (error) {
        console.log(error);
        handleError(
            'Error al realizar la acción',
            500,
            `Ocurrió un error con la activación del usuario, intenta nuevamente`,
            next
        )
    }

}

exports.getUsers = async(req, res, next) => {
    const {rol} = getTokenData(req)

    if(rol === "USER"){
        return handleError(
            'No tienes permisos',
            400,
            'No tienes permisos para acceder a los usuarios',
            next
        )
    }

    try {
        
        await User.findAll({where: {rol : "USER"}})
        .then(users => {
            if(users){
                return handleSuccess(
                    'Usuarios encontrados',
                    {
                        users : users.map(user => {return {
                            userId : user.userId,
                            email: user.email,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            phone: user.phone,
                            active: user.active,
                            rol: user.rol
                        }})
                    },
                    req, res
                )
            } else {
                return handleError (
                    'No se encontraron usuarios',
                    400,
                    '',
                    next
                )
            }
        })
        .catch(err => {
            handleError(
                'Error',
                400,
                'Ocurrió un error al obtener los usuarios',
                next
            )
        })

    } catch (error) {
        console.log(error);
        handleError(
            'Error al cargar los usuarios',
            400,
            'Ocurrió un error al obtener los usuarios de la base de datos',
            next
        )
    }
}