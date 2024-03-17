const {handleSuccess, handleError} = require('../middlewares/responses')
const Folder = require('../models/folders')
const Password = require('../models/passwords')
const getTokenData = require('../utils/getTokenData')

module.exports.createPassword = async(req, res, next) => {
    const {name, username, password, url, folderId} = req.body
    const {id} = getTokenData(req)

    try {

        const credential = await Password.findOne({
            where: {
                name : name
            }
        })

        const folder = await Folder.findOne({
            where: {
                folderId : folderId
            }
        })

        if(!folder){
            return handleError(
                'Carpeta no existe',
                400,
                'No existe la carpeta a la que intentas acceder',
                next
            )
        }

        if(credential?.folderId === folder.folderId){
            return handleError(
                'Credencial ya existe en la carpeta',
                400,
                'Ya existe una credencial con el nombre indicado',
                next
            )
        }

        if(!folderId){
            return handleError(
                'Carpeta no existente',
                400,
                'No existe la carpeta a la que intentas agregar la credencial',
                next
            )
        }
        console.log(id, folder.userId);
        if(folder.userId !== id){
            return handleError(
                'No tienes permiso',
                400,
                'No tienes permiso de editar esta carpeta',
                next
            )
        }

        await Password.create({
            name: name,
            username: username,
            password: password,
            url: url,
            folderId: folderId
        })
        .then(() => {
            handleSuccess(
                'Contraseña agregada exitosamente',
                {
                    name: name,
                    username: username,
                    password: password
                },
                res, res
            )
        })
        
    } catch (error) {
        console.log(error);
        handleError(
            'Error al crear contraseña',
            400,
            'Ocurrió un error al crear la contraseña',
            next
        )        
    }
}

module.exports.updatePassword = async(req, res, next) => {
    const {id, name, username, password: newPassword, url, folderId} = req.body
    const {id : userId} = getTokenData(req)

    try {

        const folder = await Folder.findOne({where: {folderId : folderId}})
        const password = await Password.findOne({where: {passwordId : id}})

        if(folder.userId !== userId){
            return handleError(
                'No tienes permiso',
                400,
                'No tienes permisos sobre esta carpeta',
                next
            )
        }

        if(!password){
            return handleError(
                'No existe la credencial',
                400,
                'No existe la credencial que intentas modificar',
                next
            )
        }

        let observaciones = []

        console.log(folderId, password.folderId);
        if(parseInt(folderId) !== parseInt(password.folderId)) observaciones.push(`La credencial fue cambiada de carpeta a: ${folder.name}`)

        await password.update({
            name: name, 
            username: username, 
            password: newPassword, 
            url: url, 
            folderId: folderId 
        })
        .then(() => {
            handleSuccess(
                'Credencial actualizada',
                {
                    name: name,
                    observations: observaciones
                },
                req, res
            )
        })

    } catch (error) {
        console.log(error);
        handleError(
            'Error al actualizar',
            400,
            'Ocurrió un error al actualizar la carpeta',
            next
        )
    }
}

module.exports.deletePassword = async(req, res, next) => {
    const {id, folderId} = req.body
    const {id : userId} = getTokenData(req)

    try {
        const folder = await Folder.findOne({
            where: {
                folderId: folderId
            }
        })        

        if(!folder){
            return handleError(
                'Carpeta no encotrada',
                400,
                'No se encontró la carpeta a editar en la base de datos',
                next  
            )
        }

        if(folder && folder.userId !== userId){
            return handleError(
                'No tienes permisos sobre esta carpeta',
                400,
                'No tienes permisos para editar esta carpeta'
            )
        }

        await Password.destroy({
            where: {
                passwordId : id
            }
        })
        .then((numRowsDeleted ) => {
            if(numRowsDeleted === 1){
                handleSuccess(
                    'Credencial eliminada',
                    null,
                    req, res
                )
            } else {
                handleError(
                    'Credencial no encontrada',
                    400,
                    'No se encontró la credencial a eliminar',
                    next
                )
            }
        })

    } catch (error) {
        handleError(
            'Error al eliminar',
            400,
            'Ocurrió un error al eliminar la credencial'
        )
    }
}