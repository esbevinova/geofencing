const express = require("express");
const { ObjectId } = require('mongodb');
const router = express.Router();
const data = require("../data");
const axios = require("axios");
const users = data.usersData;
const geofences = data.geofences



router.get("/", async (req, res) => {
  //check if user logged in. If not, show 401 error otherwise render /geofence page
    if(req.session.authority == true)
    {
        var userID = req.session.userID;
        var userResult = await users.get(userID);
        if(userResult == null){
            userResult = ["None"]
        }
        var myGeofences = await geofences.getMyGeofences(userID);

        res.status(200).render("geofence",
        {
            userResult : userResult,
            myGeofences : myGeofences,   
        })
        
        return  
        }
        
        res.status(401).render('errorPage', { e: { statusCode: "401", error: "You are not logged in, please login", redirect: "/" } })
    });



    

  module.exports = router;
