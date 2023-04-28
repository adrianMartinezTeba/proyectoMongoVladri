const Comment = require('../models/Comment');
const Post = require('../models/Post')

const CommentController = {
    async create(req, res, next) {
        try {
            const comment = await Comment.create({...req.body, userId : req.user._id, postId : req.params._id})
            await Post.findByIdAndUpdate(req.params._id, {$push:{ comments : comment}})
            res.status(201).send(comment)
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: 'Ha habido un problema al crear el comment' })
            next(error)
        }
    },
    async update(req, res, next) {
        try {
            const comment = await Comment.findByIdAndUpdate(
                req.params._id, req.body,
                {new: true})
                res.status(201).send(comment)
            
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: 'Ha habido un problema al actualizar el comment' })
            next(error)

        }
    }
}

module.exports = CommentController;