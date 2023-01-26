const bcrypt = require("bcryptjs");

const User = require("../models/user");

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
module.exports = {
  register,
};
