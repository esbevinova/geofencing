const express = require("express");
const router = express.Router();
const data = require("../data");
const users = data.usersData;

router.get("/", async (req, res) => {
    //checks for authorization. If not logged in show 401 error otherwise render /childAdded if successful
    if(req.session.authority == true)
    {
        var userID = req.session.userID;
        var userResult = await users.get(userID);
        if(userResult == null){
            userResult = ["NA"]
        }
        res.status(200).render("childAdded",
        {
            userResult : userResult
        })
        return
    }
 
    res.status(401).render('errorPage', { e: { statusCode: "401", error: "You are not logged in, please login", redirect: "/" } })
  });
  
  module.exports = router;