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

Cors
CORS (Cross-Origin Resource Sharing o en español Intercambio de recursos de origen cruzado) es un sistema que consiste en transmitir HTTP headers (en-US), que determina si los navegadores bloquean el acceso del código JavaScript frontend a las respuestas de peticiones de origen cruzado.

La política de seguridad del mismo origen prohíbe el acceso a los recursos de orígenes cruzados. Pero CORS brinda a los servidores web la capacidad de decir que desean optar por permitir el acceso de origen cruzado a sus recursos.

En otras palabras : permite hacer peticiones a tu mismo servidor

Ejmplo: npm i cors y en el index.js:
```js
const cors = require("cors")
app.use(cors())
```

# Multer 🌄
Multer es un middleware para Express y Node. js que hace que sea fácil manipular este multipart/form-data cuando tus usuarios suben archivos.

npm i multer
En la carpeta “middlewares” creamos un archivo llamado “multer.js” (Además crearemos carpeta Uploads para que las img se almacenen).
Middleware multer:
```js
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
```
Creamos una carpeta en la raiz del proyecto _public_ que es donde le hemos indicado en el middleware de multer.js la ruta a la carpeta donde se van a guardar los archivos que vallamos a subir a los posts.

En las rutas importamos el middleware multer.
Importamos multer a las rutas:
```js
const upload = require("../middlewares/multer");
```
Añadimos multer a las rutas de endpoints (ejemplos para create y update).
Importamos multer a las rutas de los endpoints con:
```js
upload.single("img");
router.post("/create", authentication, upload.single("img"), PostController.create);
router.put("/update/:_id", authentication, isAuthor, upload.single("img"), PostController.update);
```
En el index.js añadimos:
```js
app.use(express.static("./public"))
```
Donde .static indica que puede acceder a otra carpeta que esta en otra base de datos que no esta en el mismo proyecto de FRONT.

# Tecnologias usadas 🛠️

* [Visual Studio Code](https://code.visualstudio.com) - El framework para crear aplicaciones web 
* [NodeJS](https://www.npmjs.com) - Sistema gestion de paquetes
* [Express](https://www.npmjs.com/package/express) - Node  usada para servidor
* [MongoDb-Atlas](https://cloud.mongodb.com/) - Base de datos usada para el proyecto
* [Mongoose](https://mongoosejs.com/) - constructor de MongoDB
*[Postman](https://www.postman.com/) - Herramienta que hace de servidor para comprobar los endpoints
* [Vercel](https://vercel.com/) - Servidor usado para levantar el proyecto en la red
* [Trello](https://trello.com/) -  Heramienta usada para el reparto de tareas

# Funcionamiento api

En esta seccion vamos a mostrar ejemplo del codigo de nuestra api:

Este es un ejemplo de como seria los endpoints de dar like y quitar like de nuestra red social donde usamos mongoose para hacer las consultas:

``` js
 async like(req, res,next) {
    try {
      //actualizamos el post y le sumamos un like
      const likeCheck =  await Post.findById(req.params._id)
      if (likeCheck.likes.includes(req.user._id)){
        return res.status(400).send({ message: "Ya has dado like a este post" }); 
      }
      
      const post = await Post.findByIdAndUpdate(
        req.params._id,
        { $push: { likes: req.user._id } },
        { new: true }
      )
      //guardamos el post en el array de likes del usuario
      await User.findByIdAndUpdate(
        req.user._id,
        { $push: { likes: req.params._id } },
        { new: true }
      );
      res.status(200).send({message:'like dado correctamente',post});
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Ha habido un problema con tu like" });
         next(error);
    }
  },async unlike(req, res,next) {
    try {
      // actualizamos el post y eliminamos el like
      const post = await Post.findByIdAndUpdate(
        req.params._id,
        { $pull: { likes: req.user._id } },
        { new: true }
      );
      // eliminamos el post del array de likes del usuario
      await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { likes: req.params._id } },
        { new: true }
      );
      res.status(200).send({ message: 'Unlike quitado correctamente', post });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Ha habido  un problema quitando tu like" });
         next(error);
    }
  }
  ```
Aqui podemos observas como seria el codigo para los endpoints de registrar usuario y el de confirmar correo de registro

```js
 async register(req, res, next) {
    try {
      const password = await bcrypt.hash(req.body.password, 10)
      const user = await User.create({ ...req.body, password, role: 'user' })
      const emailToken = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET, { expiresIn: '48h' })//incriptado email
      const url = 'http://localhost:8080/users/confirm/' + emailToken
      await transporter.sendMail({
        to: req.body.email,
        subject: "Confirme su registro",
        html: `<h3>Bienvenido, estás a un paso de registrarte </h3>
    <a href="${url}"> Click para confirmar tu registro</a> 
    Confirme su correo en 48 horas`,
      }); res.status(201).send({ message: "Usuario registrado con exito", user });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
    async confirm(req, res, next) {
    try {
      const payload = jwt.verify(req.params.email, process.env.JWT_SECRET)//desincriptado email
      await User.findOneAndUpdate({ email: payload.email }, { confirmed: true });
      res.status(201).send("Usuario confirmado con éxito");
    } catch (error) {
      console.error(error);
      next(error)
    }
  }
```
Tambien en nuestra red social se pueden agregar comentarios a los posts a traves de este endppoint de crear comentarios
``` js
 async create(req, res, next) {
        try {
            const comment = await Comment.create({ ...req.body, userId: req.user._id, postId: req.params._id })
            await Post.findByIdAndUpdate(req.params._id, { $push: { comments: comment } })
            res.status(201).send(comment)
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: 'Ha habido un problema al crear el comment' })
            next(error)
        }
    }
```
Aqui dejo ejemplo de como seria el codigo de un modelo en mongoose con las referencias correspondientes

``` js
const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;
const PostSchema = new mongoose.Schema({

  title: {
    type: String,
    required: [true, 'Por favor ingrese un título'],
  },
  content: {
    type: String,
    required: [true, 'Por favor ingrese algo de contenido']
  },
  userId: {
    type: ObjectId,
    ref: 'User'
  },
  comments: [
    { type: ObjectId, ref: 'Comment' }
  ],
  likes: [{ type: ObjectId, ref: 'User' }],
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
```

Teniendo las funciones de los endpoints ahora tendriamos que tener las rutas correspondientes a su codigo aqui dejo todas las rutas relacionadas con posts 
``` js
const express = require('express');
const {authentication, isAuthorPost} = require('../middlewares/authentication')
const PostController = require('../controllers/PostController');

const router = express.Router()


router.post('/createPost',authentication,PostController.create)
router.put('/updatePost/:_id',authentication,isAuthorPost,PostController.update)
router.delete('/deletePost/:_id',authentication,isAuthorPost,PostController.delete)
router.get('/getById/:_id',PostController.postById)
router.get('/getByTitle/:title',PostController.postByTitle)
router.get('/getAll',PostController.getAllInf)
router.put('/like/:_id',authentication,PostController.like)
router.put('/unlike/:_id',authentication,isAuthorPost,PostController.unlike)

module.exports = router;
```

Y con su siguiente paso para que funcione que seria la relacion con el index.js

``` js
const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3001;
const { dbConnection } = require("./config/config")
app.use(express.json())
dbConnection()
const { handleTypeError } = require("./middlewares/errors");

app.use("/users", require("./routes/users"));
app.use("/comments", require("./routes/comments"));
app.use('/posts', require('./routes/posts'));

app.use(handleTypeError)



app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));
```
Y con esto podrias construir el back-end de tu API de bases de datos no relacionales con mongoDB y las demas tecnologias ya mencionadas
## Autores ✒️ 

* **Volodymyr Kolomiiets**  [VolodymyrKolomiets](https://github.com/VolodymyrKolomiets)
* **Adrian Martinez Teba** [adrianMartinezTeba](https://github.com/adrianMartinezTeba)


