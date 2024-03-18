exports.login = {
    email: 'El correo electrónico es requerido',
    password: 'La contraseña es requerida'
}

exports.createUser = {
    firstName: "El nombre es obligatorio",
    lastName: "El apellido es obligatorio",
    email: "El correo electrónico es obligatorio",
    phone: "El número de teléfono es obligatorio",
}

exports.changePassword = {
    password: "Ingresa la contraseña"
}

exports.resetPassword = {
    id: "Ingresa id del usuario"
}

exports.activateUser = {
    id: "Ingresa el id del usuario"
}

exports.editUser = {
    firstName: "Ingresa el nombre",
    lastName: "Ingresa el apellido",
    phone: "Ingresa el número de telefono",
    email: "Ingresa el correo electrónico actual",
    id: "Ingresa el id del usuario"
}

exports.createFolder = {
    name: "El nombre de requerido"
}

exports.updateFolder = {
    name: "El nombre de requerido",
    id: "El id de la carpeta es requerido"
}

exports.activateFolder = {
    active: "El estado de activación requerido",
    id: "El id de la carpeta es requerido"
}

exports.createPassword = {
    name : "El nombre de la credencial es obligatorio", 
    username: "El usuario de la credencial es obligatorio", 
    password: "La contraseña de la credencial es obligatoria", 
    url: "La URL de la credencial es obligatoria", 
    folderId: "Debes agregar la credencial a una carpeta"
}

exports.updatePassword = {
    id : "El id es requerido", 
    name : "El nombre es requerido", 
    username : "El usuario es requerido", 
    password : "La contraseña es requerida", 
    url : "La url es requerida", 
    folderId : "La carpeta es requerida"
}

exports.deletePassword = {
    id: "El id de la credencial es requerido",
    folderId: "El id de la carpeta es requerido"
}