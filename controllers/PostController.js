const Post = require('../models/Post');

const PostController = {
  async create(req, res) {
    try {
      const post = await Post.create(req.body)
      res.status(201).send(post)
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
        }
      );
      res.send({ message: "Post successfully updated", post });
    } catch (error) {
      console.error(error);
    }
  },
  async delete(req, res) {
    try {
      const post = await Post.findByIdAndDelete(req.params._id);
      res.send({ message: "Post deleted", post });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "there was a problem trying to remove the post",
      });
    }
  },
  async postWithUsersAndComments(req, res) {
    try {

    } catch (error) {

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
      res.send({ message: "Post encontrado con exito",post })

    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "there was a problem trying to remove the post",
      })
    }
  }
}

module.exports = PostController;