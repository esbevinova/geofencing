const express = require("express");
const router = express.Router();
const data = require("../data");
const children = data.childrenData
const users = data.usersData;
const geofences = data.geofences;


router.get("/", async (req, res) => {
    //check if user logged in. If not show 401 error otherwise render /addChildToGeofence page
    if(req.session.authority == true)
    {
        var userID = req.session.userID;
        var userResult = await users.get(userID);
        if(userResult == null){
            userResult = ["None"]
        }
        res.status(200).render("addChildToGeofence",
        {
            userResult : userResult
        })
        return  
    }
    res.status(401).render('errorPage', { e: { statusCode: "401", error: "You are not logged in, please login", redirect: "/" } })
});

router.post("/", async (req, res) => {
    var userId = req.session.userID;
    //updates both collections, children and geofences then renders /geofenceAdded page if successful
    var addedGeofenceToChild = await children.addGeofenceToChild(req.body.geofencesName, req.body.childsPhoneNumber);
    var addedChildtoGeofence = await geofences.addTheChildToGeofence(req.body.geofencesName, req.body.childsPhoneNumber);
    var addedGeofenceToChildArray = await users.addGeofenceToChildArray(userId, req.body.geofencesName, req.body.childsPhoneNumber)
    //add to User's Children Array
    res.status(200).render("geofenceAdded", {});
});

module.exports = router;

