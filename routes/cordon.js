const express = require("express");
const router = express.Router();
const data = require("../data");
const users = data.usersData;
const bcrypt = require("bcrypt")
const xss = require ('xss');

router.get("/", async (req, res) => {
    res.render("cordon", {});
  });

module.exports = router;