const express = require("express");
const bodyparser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const { API_VERSION } = require("./constants");
const app = express();

//configure middleware
app.use(morgan("dev"));

// import routings
const authRoutes = require("./router/auth");
const userRoutes = require("./router/user");
const menuRoutes = require("./router/menu");
const courseRoutes = require("./router/course");
const postRoutes=require("./router/post");

// configure body parser
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

// configure static folder
app.use(express.static("uploads"));
app.use(express.json());
// configure header http - cors
app.use(cors());

// configure routings
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, menuRoutes);
app.use(`/api/${API_VERSION}`, courseRoutes);
app.use(`/api/${API_VERSION}`, postRoutes);

module.exports = app;
