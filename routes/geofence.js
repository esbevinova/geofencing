const express = require("express");
const router = express.Router();
const data = require("../data");
const users = data.usersData;


router.get("/", async (req, res) => {
    if(req.session.authority == true)
    {
        var userID = req.session.userID;
        var userResult = await users.get(userID);
        if(userResult == null){
            userResult = ["None"]
        }
        res.status(200).render("geofence",
        {
            userResult : userResult
        })
        return  
    }
 
    res.status(401).render('errorPage', { e: { statusCode: "401", error: "You are not logged in, please login", redirect: "/" } })
});

/*
This is where we need to list all of the existing Geofences
*/
  
  module.exports = router;