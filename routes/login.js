const express = require("express");
const router = express.Router();
const data = require("../data");
const users = data.usersData;
const bcrypt = require("bcrypt")
const xss = require('xss');

router.get("/", async (req, res) => {
  res.status(200).render("loginPage/loginPage", {});
});

router.post("/", async (req, res, next) => {
  console.log('in login post')
  xss(req.body);
  var requestBody = req.body
  var userName = requestBody.userName
  var password = requestBody.password

  console.log(userName, password);

  try {
    if (userName === "") {
      res.status(403).render("loginPage/loginPage",
        {
          hasError: true,
          error: "The user name should not be empty !"
        });
      return;
    }

    if (password === "") {
      res.status(403).render("loginPage/loginPage",
        {
          hasError: true,
          error: "The password should not be empty !"
        });
      return;
    }
    const result = await users.getUserbyname(userName)
    if (result === null) {
      res.status(403).render("loginPage/loginPage",
        {
          hasError: true,
          error: "Invalid user name or password!"
        });
      return;
    }
    //compares provided password of the username provided. If successful, renders /homepage.
    const compareResult = await bcrypt.compare(password, result.password);
    if (result != null && compareResult == true) {
      req.session.authority = true
      req.session.userID = result._id
      req.session.userName = result.username
      res.status(305).redirect("/homepage")
      return;
    }

    res.status(403).render("loginPage/loginPage",
      {
        hasError: true,
        error: "Invalid user name or password!"
      });
    return;
  }
  catch (error) {

  }
});

module.exports = router;