const express = require("express");
const router = express.Router();
const data = require("../data");
const users = data.usersData;

router.get("/", async (req, res) => {
    if(req.session.authority == true)
    {
        //console.log(result)
        //console.log(req.session)
        var userID = req.session.userID;
        var userResult = await users.get(userID);
        console.log(userResult)
        if(userResult == null){
            userResult = ["Does not apply any job! Right Now"]
        }
        //console.log(userResult);
        res.status(200).render("homepage",
        {
            userResult : userResult
        })
        return
    }
 
    res.status(401).render('errorPage', { e: { statusCode: "401", error: "You are not logged in, please login", redirect: "/" } })
  });
  
  module.exports = router;