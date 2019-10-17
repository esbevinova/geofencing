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

router.post("/", async (req, res) =>{

    const geofenceData = req.body
    var currentUser = req.session.userID;
    // Call Geocode
    // Get location form
    var locationForm = document.getElementById('location-form');

    // Listen for submit
    locationForm.addEventListener('submit', geocode);

    function geocode(e){
      // Prevent actual submit
      e.preventDefault();
   
      var location = document.getElementById('geofenceLcn').value;

      axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
        params:{
          address:location,
          key:'AIzaSyDAvtiMO_fBipcjY_VBJF-1px9GVBfSLiQ'
        }
      })
      .then(function(response){
        // Log full response
        console.log(response);
        // Formatted Address
        var formattedAddress = response.data.results[0].formatted_address;
        // Geometry
        var lat = response.data.results[0].geometry.location.lat;
        var lng = response.data.results[0].geometry.location.lng;
        console.log(lat)
      })
      .catch(function(error){
        console.log(error);
      });
    }})
    
  
  module.exports = router;