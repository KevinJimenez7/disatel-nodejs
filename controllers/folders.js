const {handleSuccess, handleError} = require('../middlewares/responses')
const Folder = require('../models/folders')
const Password = require('../models/passwords')
const { User } = require('../models/users')
const getTokenData = require('../utils/getTokenData')

module.exports.createFolder = async(req, res, next) => {
    const {name} = req.body
    const {id} = getTokenData(req)

    try {
        await Folder.create({
            name: name,
            userId: id
        })
        .then(() => {
            handleSuccess(
                'Carpeta creada exitosamente',
                {
                    name: name
                },
                res, res
            )
        })
        
    } catch (error) {
        handleError(
            'Error al crear Carpeta',
            400,
            'Ocurrió un error al crear la carpeta'
        )        
    }
}

module.exports.updateFolder = async(req, res, next) => {
    const {name, id} = req.body
    const {id : userId} = getTokenData(req)

    try {
        const folder = await Folder.findOne({
            where: {
                folderId: id
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

        await folder.update({
            name: name
        })
        .then(() => {
            handleSuccess(
                'Carpeta actualizada',
                {
                    name: name
                },
                req, res
            )
        })

    } catch (error) {
        handleError(
            'Error al actualizar',
            400,
            'Ocurrió un error al actualizar la carpeta'
        )
    }
}

module.exports.activateFolder = async(req, res, next) => {
    const {id, active} = req.body
    const {id : userId} = getTokenData(req)

    try {
        const folder = await Folder.findOne({
            where: {
                folderId: id
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

        await folder.update({
            active: active
        })
        .then(() => {
            handleSuccess(
                'Carpeta actualizada',
                {
                    name: folder.name,
                    active: active
                },
                req, res
            )
        })

    } catch (error) {
        handleError(
            'Error al actualizar',
            400,
            'Ocurrió un error al actualizar la carpeta'
        )
    }
}

exports.getCredentials = async(req, res, next) => {
    const {id} = getTokenData(req)

    await User.findByPk(id, {
        include : [
            {
                model: Folder,
                include : [Password]
            }
        ]
    })
    .then(user => {
        if(user){
            return handleSuccess(
                'Credenciales encontradas',
                {
                    folders : user.folders
                },
                req, res
            )
        } else {
            return handleError(
                'Usuario no encotrado',
               400,
               'No se encontró el usuario en la base de datos',
               next 
            )
        }
    })
    .catch((err) => {
        console.log(err);
        return handleError(
            'Error',
            400,
            'Ocurrió un error al obtener las credenciales',
            next
        )
    })
}