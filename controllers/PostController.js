const Post = require('../models/Post');


const PostController = {
  async create(req, res) {
    try {
      const post = await Post.create(req.body)
      res.status(201).send({message:'Post creado correctamente',post})
    } catch (error) {
      console.error(error)
      res.status(500).send({ message: 'Ha habido un problema al crear el post' })
    }
  },
  async update(req, res) {
    try {
      const post = await Post.findByIdAndUpdate(
        req.params._id,
        { ...req.body, userId: req.user._id },
        {
          new: true,
        }//para que nos muestre por pantalla el nuevo actualizado y no el anterior aunque se actualice en la base de datos
      );
      res.send({ message: "Post actualizado correctamente", post });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Ha habido un problema al actualizar el post' })
    }
  },
  async delete(req, res) {
    try {
      const post = await Post.findByIdAndDelete(req.params._id);
      res.send({ message: "Post borrado correctamente", post });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Ha habido un problema al borrar el post",
      });
    }
  },
  async getAllInf(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const posts = await Post.find()
      .populate('userId')
      .populate({
        path: 'comments',
        populate: {
          path: 'userId'
        }
      })
        .limit(limit)
        .skip((page - 1) * limit);
       res.status(201).send({message:'Mostrando informacion correctamente',posts});
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Ha habido un problema al intentar coger la informacion",
      });
    
    }
  },
  async postByName(req, res) {
    try {
      if (req.params.name.length > 20) {
        // validacion para la expresion regular y que no se buggue
        return res.status(400).send("Búsqueda demasiado larga");
      }
      const name = new RegExp(req.params.name, "i");//la i significa que va a ser insensible de may y min
      const post = await Product.find({ name });//busqueda por expresion regular
      res.send({ message: "Post encontrado con exito", post })

    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Ha habido un problema al intentar coger la informacion",
      })
    }
  },
  async postById(req, res) {
    try {
      const post = await Post.findOne(req.params._id)
      res.send({ message: 'Post por id encontrado con exito', post })
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Ha habido un problema al intentar coger la informacion",
      })
    }
  },
  async like(req, res) {
    try {
      //actualizamos el producto y le sumamos un like
      const post = await Post.findByIdAndUpdate(
        req.params._id,
        { $push: { likes: req.user._id } },
        { new: true }
      );
      //guardamos el producto en el array de likes del usuario
      await User.findByIdAndUpdate(
        req.user._id,
        { $push: { likes: req.params._id } },
        { new: true }
      );
      res.send(post);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "There was a problem with your like" });
    }
  },async unlike(req, res) {
    try {
      // actualizamos el producto y eliminamos el like
      const product = await Product.findByIdAndUpdate(
        req.params._id,
        { $pull: { likes: req.user._id } },
        { new: true }
      );
      // eliminamos el producto del array de likes del post
      await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { wishList: req.params._id } },
        { new: true }
      );
      res.send(product);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "There was a problem with your unlike" });
    }
  },
}

module.exports = PostController;