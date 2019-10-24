const express = require("express");
const router = express.Router();
const data = require("../data");
const users = data.usersData;
const geofences = data.geofences
const children = data.children
const axios = require("axios")

router.get("/", async (req, res) => {
    if(req.session.authority == true)
    {
        var userID = req.session.userID;
        var userResult = await users.get(userID);
        if(userResult == null){
            userResult = ["None"]
        }
        res.status(200).render("addGeofence",
        {
            userResult : userResult
        })
        return  
    }
 
    res.status(401).render('errorPage', { e: { statusCode: "401", error: "You are not logged in, please login", redirect: "/" } })
});

router.post("/", async (req, res) => {

    const usersData = req.body;
    // console.log(usersData)


    axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
        params:{
          address:req.body.geofenceAddress,
          key:'AIzaSyDAvtiMO_fBipcjY_VBJF-1px9GVBfSLiQ'
        }
      })
      .then(async function(response){

        // Formatted Address
        formattedAddress = response.data.results[0].formatted_address;
        // Geometry
        lat = response.data.results[0].geometry.location.lat;
        lng = response.data.results[0].geometry.location.lng;

        var userID = req.session.userID;    
        var createdGeofence = await geofences.addGeofence(userID, req.body.geofenceName, formattedAddress, lat, lng, req.body.radius);
        var addGeofenceToParent = await users.addGeofenceToUser(userID, createdGeofence._id, req.body.geofenceName, formattedAddress, lat, lng, req.body.radius)
        res.status(200).render("geofenceCreated", {});
        
      });
   

  });

  module.exports = router;