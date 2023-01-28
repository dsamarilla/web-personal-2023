const { json } = require("body-parser");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
async function getMe(req, res) {
  const { user_id } = req.user;
  const response = await User.findById(user_id);
  if (!response) {
    res.status(400).send({ msg: "No se ha encontrado el usuario" });
  } else {
    res.status(200).send(response);
  }
}

async function getUsers(req, res) {
  const { active } = req.query;
  let response = null;
  if (active === undefined) {
    response = await User.find();
  } else {
    response = await User.find({ active });
  }

  res.status(200).send(response);
}

async function createUser(req, res) {
  const { password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);
  const user = new User({ ...req.body, active: false });
  const image = require("../utils/image");
  user.password = hashPassword;
  console.log(user);

  if (req.files.avatar) {
    const imagePath = image.getFilePath(req.files.avatar);
    user.avatar = imagePath;
  }

  user.save((error, userStored) => {
    if (error) {
      res.status(400).send({ msg: "Error al crear usuario" });
    } else {
      res.status(201).send(userStored);
    }
  });
}
module.exports = {
  getMe,
  getUsers,
  createUser,
};
