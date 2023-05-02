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

# Funcionamiento api

En esta seccion vamos a mostrar ejemplo del codigo de nuestra api:

Este es un ejemplo de como seria los endpoints de dar like y quitar like de nuestra red social donde usamos mongoose para hacer las consultas:

``` js
 async like(req, res) {
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
    }
  },async unlike(req, res) {
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


## Autores ✒️ 

* **Volodymyr Kolomiiets**  [VolodymyrKolomiets](https://github.com/VolodymyrKolomiets)
* **Adrian Martinez Teba** [adrianMartinezTeba](https://github.com/adrianMartinezTeba)


