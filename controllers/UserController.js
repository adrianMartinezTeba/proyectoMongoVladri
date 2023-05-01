const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const transporter = require("../config/nodemailer");


const UserController = {
  async register(req, res, next) {
    try {
      const password = await bcrypt.hash(req.body.password, 10)
      const user = await User.create({ ...req.body, password, role: 'user' })
      const emailToken = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET, { expiresIn: '48h' })//incriptado email
      const url = 'http://localhost:8080/users/confirm/' + emailToken
      await transporter.sendMail({
        to: req.body.email,
        subject: "Confirme su registro",
        html: `<h3>Bienvenido, estás a un paso de registrarte </h3>
    <a href="${url}"> Click para confirmar tu registro</a> 
    Confirme su correo en 48 horas`,
      }); res.status(201).send({ message: "Usuario registrado con exito", user });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  async login(req, res, next) {
    try {
      const user = await User.findOne({
        email: req.body.email,
      })
      if(!user){
        return res.status(400).send({message:"Usuario o contraseña incorrectos"})
        }
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res.status(400).send({ message: "Usuario o contraseña incorrectos" })
      }
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      if (user.tokens.length > 4) user.tokens.shift();
      user.tokens.push(token);
      await user.save();
      res.send({ message: "Bienvenid@ " + user.name, token });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
      next(error)

    }
  },
  async logout(req, res, next) {
    try {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { tokens: req.headers.authorization },
      });
      res.send({ message: "Desconectado con éxito" });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Hubo un problema al intentar desconectar al usuario",
      });
      next(error)
    }
  },
  async getInfo(req, res, next) {
    try {
      const user = await User.findById(req.user._id)
      .populate({
        path: "postIds.post",
        select: "title",
      })
      res.send(user);
    } catch (error) {
      console.error(error);
      next(error)
    }
  },
  async confirm(req, res, next) {
    try {
      const payload = jwt.verify(req.params.email, process.env.JWT_SECRET)//desincriptado email
      await User.findOneAndUpdate({ email: payload.email }, { confirmed: true });
      res.status(201).send("Usuario confirmado con éxito");
    } catch (error) {
      console.error(error);
      next(error)
    }
  }
};

module.exports = UserController;