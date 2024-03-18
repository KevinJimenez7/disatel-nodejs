const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const responses = require('./middlewares/responses')
const sequelize = require('./database/config')
const auth = require('./routes/auth')
const user = require('./routes/users')
const folder = require('./routes/folders')
const password = require('./routes/passwords')
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
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//RUTAS
app.use('/auth',auth)
app.use('/user',user)
app.use('/folder',folder)
app.use('/credential',password)

//RESPUESTAS
app.use(responses.sendResponse)
app.use(responses.sendError)

module.exports = app