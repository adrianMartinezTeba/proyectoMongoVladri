const express = require('express');
const upload = require('../middlewares/multer'); 
const {authentication, isAuthorPost} = require('../middlewares/authentication')
const PostController = require('../controllers/PostController');
const upload = require("../middlewares/multer");
const router = express.Router()


router.post('/createPost',authentication, upload.single("img"), PostController.create)
router.put('/updatePost/:_id',authentication,isAuthorPost, upload.single("img"), PostController.update)
router.delete('/deletePost/:_id',authentication,isAuthorPost,PostController.delete)
router.get('/getById/:_id',PostController.postById)
router.get('/getByTitle/:title',PostController.postByTitle)
router.get('/getAll',PostController.getAllInf)
router.put('/like/:_id',authentication,PostController.like)
router.put('/unlike/:_id',authentication,isAuthorPost,PostController.unlike)

module.exports = router;