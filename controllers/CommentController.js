const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');

const CommentController = {
    async create(req, res, next) {
        try {
            const comment = await Comment.create({ ...req.body, userId: req.user._id, postId: req.params._id })
            await Post.findByIdAndUpdate(req.params._id, { $push: { comments: comment } })
            await User.findByIdAndUpdate(req.user._id,
                {$push:{commentIds:comment}})
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
                { new: true })
            res.status(201).send(comment)
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: 'Ha habido un problema al actualizar el comment' })
            next(error)

        }
    },
    async findAll(req, res, next) {
        try {
            const comment = await Comment.find(req.body)
            res.status(201).send(comment)
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: 'Ha habido un problema en encotrar los comments' })
            next(error)
        }
    },
    async delete(req, res, next) {
        try {
            const comment = await Comment.findByIdAndDelete(
                req.params._id, req.body,
                { new: true })
            res.status(201).send(comment)
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: 'Ha habido un problema al borrar el comment' })
            next(error)
        }
    }
}

module.exports = CommentController;