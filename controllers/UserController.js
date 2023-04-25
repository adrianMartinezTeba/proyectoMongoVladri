const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config/keys");
const transporter = require("../config/nodemailer");


const UserController = {
  async register(req, res, next) {
    try {
        const password = await bcrypt.hash(req.body.password, 10)
        const user = await User.create({ ...req.body, password, confirmed: false })
        const emailToken = jwt.sign({ email: req.body.email }, jwt_secret, { expiresIn: '48h' })
        const url = 'http://localhost:8080/users/confirm/' + emailToken
        await transporter.sendMail({
            to: req.body.email,
            subject: "Confirme su registro",
            html: `<h3>Bienvenido, estás a un paso de registrarte </h3>
    <a href="${url}"> Click para confirmar tu registro</a> 
    Confirme su correo en 48 horas`,
        });      res.status(201).send({ message: "Usuario registrado con exito", user });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  async login(req, res) {
    try {
      const user = await User.findOne({
        email: req.body.email,
      });
      const token = jwt.sign({ _id: user._id }, jwt_secret);
      if (user.tokens.length > 4) user.tokens.shift();
      user.tokens.push(token);
      await user.save();
      res.send({ message: "Bienvenid@ " + user.name, token });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },
  async logout(req, res) {
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
    }
  },
  async getInfo(req, res) {
    try {
      const user = await User.findById(req.user._id)
        .populate({
          path: "orderIds",
          populate: {
            path: "productIds",
          },
        })
        .populate("wishList");

      res.send(user);
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = UserController;