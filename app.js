const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const responses = require('./middlewares/responses')
const sequelize = require('./database/config')
const auth = require('./routes/auth')
const Folder = require('./models/folders')
const Password = require('./models/passwords')
const {createAdmin, User} = require('./models/users')

//BASE DE DATOS
sequelize.authenticate()
.then(async() => {
    console.log('Conexión DB establecida')
    return sequelize.sync()
})
.then(async() => {
    console.log("Modelos sincronizados correctamente");
    await createAdmin()
})
.catch((err) => {
    console.log("Ocurrió un error al conectar la DB", err);
})

//MIDDLEWARES
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//RUTAS
app.use('/auth',auth)

//RESPUESTAS
app.use(responses.sendResponse)
app.use(responses.sendError)

module.exports = app