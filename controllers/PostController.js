const Post = require('../models/Posts');

const PostController ={
    async create(req,res){
    try {
    const post = await Post.create(req.body)
    res.status(201).send(post)
    } catch (error) {
    console.error(error)
    res.status(500).send({ message: 'Ha habido un problema al crear el post' })
    }
    },
    }
    
    module.exports = PostController;