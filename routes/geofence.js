const express = require("express");
const router = express.Router();
const data = require("../data");
const users = data.usersData;
const geofences = data.geofences


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

  //outputs specific parent's information in json format
  router.post("/:id", async (req, res) => {
    try {
      const geofence = await geofences.get(req.params.id);
      res.json(geofence);
    } catch (e) {
      res.status(404).json({ error: "Geofence not found" });
    }
  });

/*
This is where we need to list all of the existing Geofences
*/


  
  module.exports = router;