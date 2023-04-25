const express = require('express');

const router = express.Router()

const PostController = require('../controllers/PostController');

router.post('/createPost',PostController.create)
router.put('/updatePost/:_id',PostController.update)

module.exports = router;