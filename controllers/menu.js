const Menu = require("../models/menu");

async function createMenu(req, res) {

  const menu = new Menu(req.body);
  menu.save((error, menuStored) => {
    if (error) {
      res.status(400).send({ msg: "Error al crear el menu" });
    } else {
        
      res.status(200).send(menuStored);
    }
  });
}

module.exports = { createMenu };
