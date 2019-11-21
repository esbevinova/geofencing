const express = require("express");
const router = express.Router();
const data = require("../data");
const users = data.usersData;
const children = data.childrenData;

router.get("/", async (req, res) => {
    if(req.session.authority == true) //checks if user logged in
    {
        var userID = req.session.userID;
        var userResult = await users.get(userID);
        
        if(userResult == null){
            userResult = ["None"]
        }
        var myChildren = await children.getMyChildren(userID);
        res.status(200).render("viewChildren",
        {
            userResult : userResult,
            myChildren : myChildren
        })
        return
    }
    res.status(401).render('errorPage', { e: { statusCode: "401", error: "You are not logged in, please login", redirect: "/" } })
  });




  module.exports = router;

