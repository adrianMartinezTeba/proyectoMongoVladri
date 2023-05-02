const Post = require('../models/Post');
const User = require('../models/User')



const PostController = {
  async create(req, res,next) {
    try {
      const post = await Post.create({...req.body,userId:req.user._id})
      await User.findByIdAndUpdate(
        req.user._id,
        {$push:{postIds:post._id}}
        )
        res.status(201).send({message:'Post creado correctamente',post})


    } catch (error) {
      console.error(error)
      res.status(500).send({ message: 'Ha habido un problema al crear el post' })
      next(error);
    }
  },
  async update(req, res,next) {
    try {
      const post = await Post.findByIdAndUpdate(
        req.params._id,
        req.body,
        {
          new: true,
        }//para que nos muestre por pantalla el nuevo actualizado y no el anterior aunque se actualice en la base de datos
      );
      res.send({ message: "Post actualizado correctamente", post });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Ha habido un problema al actualizar el post' })
      next(error);
    }
  },
  async delete(req, res,next) {
    try {
      const post = await Post.findByIdAndDelete(req.params._id);
      res.send({ message: "Post borrado correctamente", post });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Ha habido un problema al borrar el post",
      });
      next(error);
    }
  },
  async getAllInf(req, res,next) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const posts = await Post.find()
      .populate({path:'userId',select:'name'})
      .populate({path:'comments',select:'text',populate:{path:'userId',select:'name'}})
      .populate({path:'likes',select:'name'})
        .limit(limit)
        .skip((page - 1) * limit);
       res.status(201).send({message:'Mostrando informacion correctamente',posts});
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Ha habido un problema al intentar coger la informacion",
      });
      next(error);
    }
  },
  async postByTitle(req, res,next) {
    try {
      if (req.params.title.length > 20) {
        // validacion para la expresion regular y que no se buggue
        return res.status(400).send("Búsqueda demasiado larga");
      }
      const title = new RegExp(req.params.title, "i");//la i significa que va a ser insensible de may y min
      const post = await Post.find({ title })
      .populate({path:'comments',select:'text',populate:{path:'userId',select:'name'}})
      .populate({path:'likes',select:'name'});//busqueda por expresion regular
      res.send({ message: "Post encontrado con exito", post })

    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Ha habido un problema al intentar coger la informacion",
      })
      next(error);
    }
  },
  async postById(req, res,next) {
    try {
      const post = await Post.findById(req.params._id)
      .populate({path:'comments',select:'text',populate:{path:'userId',select:'name'}})
      .populate({path:'likes',select:'name'})
      res.send({ message: 'Post por id encontrado con exito', post })
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Ha habido un problema al intentar coger la informacion",
      })
    }
    next(error);
  },
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
  }}
  

module.exports = PostController;