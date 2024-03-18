## PRUEBA TECNICA BACKEND
El presente proyecto fue desarrollado con Node JS y MySQL

# VARIABLES DE ENTORNO
En el archivo .env se debe configurar las variables de entorno a utilizar en el proyecto
en el mismo se encuentra: 

PORT = "8080" -- Configuracion del puerto del servidor

== CONFIGURACION DE BASE DE DATOS ==

Para realizar una conexión exitosa es importante definir primero un esquema 
en el motor de base de datos relacional a utilizar (de preferencia MySQL)
donde el nombre del mismo sea el establecido en la variable de entorno DB_NAME,
a continuación se detalla la configuración de la base de datos

DB_NAME = "disatel" --Nombre del esquema
DB_USER = "root" -- Usuario para autenticarse en la BD
DB_PASSWORD = "Ccentral2024" --Constraseña para ingresar a la BD
DB_HOST = "localhost" -- Host
DB_PORT = "3306" --Puerto

== PROTECCION DE RUTAS ==

Las rutas estan protegidas por Json Web Token, por lo que es necesario
estableces el Secret Token y el tiempo de expiracion del mismo en las
siguientes variables de entorno

ACCESS_TOKEN_SECRET = "ccentral2024"
TOKEN_EXPIRES_TIME = '1h'

== CREACION DE USUARIO ADMINISTRADOR ==

Al iniciar el proyecto se creará un usuario administrador con las credenciales
establecidas en las siguientes variables de entorno

ADMIN_EMAIL = "admin@admin.com"
ADMIN_FIRST_NAME = "test"
ADMIN_LAST_NAME = "administrador"
ADMIN_PASSWORD = "admin"
ADMIN_PHONE = "123456"

# LEVANTAR EL PROYECTO
Para iniciar el proyecto, es necesario instalar todas las dependencias del mismo
por lo que es necesario, ubicados en la carpeta del proyecto, usar el comando "npm install"
en la terminal, porteriormente es necesario con "npm start" se iniciará el servidor