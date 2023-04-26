const express = require('express');
const {authentication, isAuthorPost} = require('../middlewares/authentication')

const router = express.Router()

const PostController = require('../controllers/PostController');

router.post('/createPost',authentication,PostController.create)
router.put('/updatePost/:_id',authentication,isAuthorPost,PostController.update)
router.delete('/deletePost/:_id',authentication,isAuthorPost,PostController.delete)
router.get('/byId/:_id',PostController.postById)
router.get('/byName/:name',PostController.postByName)
router.get('/getAll',PostController.getAllInf)

module.exports = router;