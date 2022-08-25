"use strict";

require("dotenv").config();

module.exports = {
  HOST: "localhost",
  PORT: 27017,
  DB: "shop",
  secret: process.env.JWT_SECRET_KEY
};