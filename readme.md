# Descripción del proyecto

Este proyecto backend está diseñado para funcionar con una base de datos MongoDB alojada en Atlas DB. Está construido con el framework Node.js y utiliza la biblioteca de Mongoose para interactuar con la base de datos.

La aplicación se despliega en Vercel, lo que significa que está disponible en línea y puede ser accedida desde cualquier lugar. O se puede usar con el Postman.

# Configuración
Para configurar la aplicación, debe seguir estos pasos:

Clone el repositorio de GitHub a su máquina local
Ejecute npm install en la línea de comando para instalar todas las dependencias necesarias
Crea una base de datos MongoDB en Atlas DB
Crea un archivo .env en el directorio raíz del proyecto y agregue las siguientes variables de entorno:

```js
DB_URI=<Inserte aquí la URL de conexión de su base de datos Atlas>
```

Ejecute npm run dev para iniciar la aplicación

# Uso

Una vez que la aplicación esté funcionando, podrá acceder a ella a través de una API RESTful. Aquí hay algunos ejemplos de solicitudes que puede realizar:

Para obtener todos los registros en una colección: GET /collection
Para agregar un nuevo registro a una colección: POST /collection
Para actualizar un registro existente: PUT /collection/:id
Para eliminar un registro: DELETE /collection/:id
En cada solicitud, debe proporcionar los datos necesarios en el cuerpo de la solicitud.

# Tecnologias usadas 🛠️

* [Visual Studio Code](https://code.visualstudio.com) - El framework para crear aplicaciones web 
* [NodeJS](https://www.npmjs.com) - Sistema gestion de paquetes
* [Express](https://www.npmjs.com/package/express) - Node  usada para servidor
* [MongoDb-Atlas](https://cloud.mongodb.com/) - Base de datos usada para el proyecto
* [Mongoose](https://mongoosejs.com/) - constructor de MongoDB
*[Postman](https://www.postman.com/) - Herramienta que hace de servidor para comprobar los endpoints
* [Vercel](https://vercel.com/) - Servidor usado para levantar el proyecto en la red
* [Trello](https://trello.com/) -  Heramienta usada para el reparto de tareas

## Autores ✒️ 

* **Volodymyr Kolomiiets**  [VolodymyrKolomiets](https://github.com/VolodymyrKolomiets)
* **Adrian Martinez Teba** [adrianMartinezTeba](https://github.com/adrianMartinezTeba)


