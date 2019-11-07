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
        var myGeofences = await geofences.getMyGeofences(userID);
        //List of geofences for a given user
        var myFences = [];
        console.log(myGeofences)
        var i;
        for (i = 0; i < myGeofences.length; i++) {
            myFences.push(myGeofences[i].geofenceName);
        }
        console.log(myFences)
        res.status(200).render("geofence",
        {
            userResult : userResult,
            myFences: myFences
        })

        return  
    }
 
    res.status(401).render('errorPage', { e: { statusCode: "401", error: "You are not logged in, please login", redirect: "/" } })
});



  //outputs specific parent's information in json format
  // router.post("/:id", async (req, res) => {
  //   try {
  //     const geofence = await geofences.get(req.params.id);
  //     res.json(geofence);
  //   } catch (e) {
  //     res.status(404).json({ error: "Geofence not found" });
  //   }
  // });

  
  /*
  This is where we need to list all of the existing Geofences
  */
 

  //11.03

//   router.get('/geofence', async (req, res) => {
//     res.render('geofence', { myGeofences: myGeofences })
//   })


  
  // router.get("/geofence", async (req, res) => {
  //   try {
  //     console.log("BEFORE")
  //     const myUser = userResult._id;
  //     getMyGeofences(myUser);
  //     res.render("geofence", {myGeofences});
  //     console.log("its working")
  //   } catch (e) {
  //     res.status(404).json({ error: "Geofence not found" });
  //   }
  //   //var fences = ["hello", "Molly", "!"];
  //   //document.getElementById("myfences").innerHTML = fences;
  //   fences = JSON.parse(myGeofences);
  //   return fences
    
    // var fences, text;
    // fences = ["hello", "Molly", "!"];

    // text = "<ul>";
    // fences.forEach(myFunction);
    // text += "</ul>";
    // document.getElementById("myfences").innerHTML = text;

    // function myFunction(value) {
    // text += "<li>" + value + "</li>";
    // } 

    //document.getElementById("myfences").innerHTML = fences;
  //});
  //11.03.end



  
  module.exports = router;