const express = require("express")
const CommentController = require("../controllers/CommentController")
const { authentication,isAuthorComment } = require("../middlewares/authentication")
const router = express.Router()

router.post("/create/:_id",authentication, CommentController.create)
router.put("/update/:_id",authentication, isAuthorComment, CommentController.update)
router.get("/findAllcomments",authentication, CommentController.findAll)
router.delete("/delete/:_id",authentication, CommentController.delete)

module.exports = router
