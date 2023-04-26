const express = require("express")
const CommentController = require("../controllers/CommentController")
const { authentication } = require("../middlewares/authentication")
const { isAuthorComment } = require("../middlewares/authentication")
const router = express.Router()

router.post("/create",authentication, CommentController.create)
router.put("/update/:_id",authentication, isAuthorComment, CommentController.update)

module.exports = router
