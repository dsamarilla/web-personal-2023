const bcrypt = require("bcryptjs");

const User = require("../models/user");

const jwt = require("../utils/jwt");

function register(req, res) {
  const { firstname, lastname, email, password } = req.body;
  //console.log(req.body);
  //console.log("Se ha ejecutado el registro");
  if (!email) res.status(400).send({ msg: "El email es obligatorio" });
  if (!password) res.status(400).send({ msg: "La contraseña es obligatoria" });
  const user = new User({
    firstname,
    lastname,
    email: email.toLowerCase(),
    role: "user",
    active: false,
    password,
  });

  const salt = bcrypt.genSaltSync(10);
  const hashpassword = bcrypt.hashSync(password, salt);
  user.password = hashpassword;

  user.save((error, userStorage) => {
    if (error) {
      res.status(400).send({ msg: "Error al crear usuario!" });
    } else {
      res.status(200).send(userStorage);
    }
  });
  //console.log(user);

  //res.status(200).send({ msg: "Todo OK" });
}

function login(req, res) {
  const { email, password } = req.body;
  if (!email) res.status(400).send({ msg: "El email es obligatorio" });
  if (!password) res.status(400).send({ msg: "La contraseña es obligatoria" });

  const emailLowerCase = email.toLowerCase();
  User.findOne({ email: emailLowerCase }, (error, userStore) => {
    if (error) {
      res.status(500).send({ msg: "Error en el servidor" });
    } else {
      bcrypt.compare(password, userStore.password, (bcryptError, check) => {
        if (bcryptError) {
          res.status(500).send({ msg: "Error en el servidor" });
        } else if (!check) {
          res.status(400).send({ msg: "Usuario o contraseña incorrecto" });
        } else if (!userStore.active) {
          res
            .status(401)
            .send({ msg: "Usuario no autorizado o no está activo" });
        } else {
          res.status(200).send({
            access: jwt.createAccessToken(userStore),
            refresh: jwt.createRefreshToken(userStore),
          });
        }
      });
    }
  });
}
module.exports = {
  register,
  login,
};
