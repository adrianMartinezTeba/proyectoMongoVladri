const express = require("express")
const CommentController = require("../controllers/CommentController")
const { authentication,isAuthorComment } = require("../middlewares/authentication")
const router = express.Router()

router.post("/create/:_id",authentication, CommentController.create)
router.put("/update/:_id",authentication, isAuthorComment, CommentController.update)

module.exports = router
