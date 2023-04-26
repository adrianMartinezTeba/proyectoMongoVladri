const express = require('express');
const {authentication} = require('../middlewares/authentication')
const {isAuthor} = require('../middlewares/authentication')

const router = express.Router()

const PostController = require('../controllers/PostController');

router.post('/createPost',authentication,PostController.create)
router.put('/updatePost/:_id',authentication,isAuthor,PostController.update)
router.delete('/deletePost/:_id',authentication,isAuthor,PostController.delete)
router.get('/byId/:_id',PostController.postById)
router.get('/byName/:name',PostController.postByName)
router.get('/getAll',PostController.getAllInf)
router.put('/like',authentication,PostController.like)
router.put('/unlike',authentication,PostController.unlike)

module.exports = router;