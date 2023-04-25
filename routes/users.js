const express = require("express")
const UserController = require("../controllers/UserController")
const { authentication } = require("../middlewares/authentication")
const router = express.Router()

router.post("/register",UserController.register)
router.post("/login",UserController.login)
router.delete("/logout",authentication, UserController.logout)
router.get("/userInfo",authentication, UserController.getInfo)
module.exports = router