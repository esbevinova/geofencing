const express = require("express");
const router = express.Router();
const data = require("../data");
const  users = data.usersData;
const xss = require ('xss');

router.get("/", async (req, res) => {
  xss(req.body);
  res.render("loginPage/signup", {});
});

module.exports = router;