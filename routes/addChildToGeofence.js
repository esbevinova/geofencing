const express = require("express");
const router = express.Router();
const data = require("../data");
const children = data.childrenData
const users = data.usersData;
const geofences = data.geofences;


router.get("/", async (req, res) => {
    //check if user logged in. If not show 401 error otherwise render /addChildToGeofence page
    //Get all the children for the user
    if(req.session.authority == true)
    {
        var userID = req.session.userID;
        var userResult = await users.get(userID);
        if(userResult == null){
            userResult = ["None"]
        }
        res.status(200).render("addChildToGeofence",
        {
            userResult : userResult,
        })
        return  
    }
    res.status(401).render('errorPage', { e: { statusCode: "401", error: "You are not logged in, please login", redirect: "/" } })
});

//Get geofence to add a child to 
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    var geofenceToAddChild = await geofences.getGeofence(id);
    var userID = geofenceToAddChild.parentId
    var myChildren = await children.getMyChildren(userID);
    //return res.send(`<h1>${id}</h1>`);
    res.status(200).render("addChildToGeofence",
    {
        geofenceToAddChild : geofenceToAddChild,
        myChildren : myChildren,
    })
    return 
});

//Add child to geofences
//Update collections: children, geofences, users
router.use('/:geofenceId/:id', async (req, res) =>{
    var userId = req.session.userID;
    const { geofenceId } = req.params;
    console.log(geofenceId)
    const { id } = req.params;
    console.log(id)
    var childToAdd = await children.get(id);
    var geofenceToAdd = await geofences.getGeofence(geofenceId)
    console.log("geofenceToAdd ")
    console.log(geofenceToAdd)
    console.log(childToAdd)
    console.log(childToAdd.childPhoneNumber)

    var addedGeofenceToChild = await children.addGeofenceToChild(geofenceToAdd.geofenceName, childToAdd.childPhoneNumber);
    //var addedChildtoGeofence = await geofences.addTheChildToGeofence(geofenceToAdd.geofenceName, childToAdd.childPhoneNumber);
    var addedGeofenceToChildArray = await users.addGeofenceToChildArray(userId, geofenceToAdd.geofenceName, childToAdd.childPhoneNumber)
    res.status(200).render("geofenceAdded", 
    {
        childToAdd : childToAdd,
        geofenceToAdd : geofenceToAdd
    })
    return
})

// router.post("/", async (req, res) => {
//     var userId = req.session.userID;
//     //updates both collections, children and geofences then renders /geofenceAdded page if successful
//     var addedGeofenceToChild = await children.addGeofenceToChild(req.body.geofencesName, req.body.childsPhoneNumber);
//     var addedChildtoGeofence = await geofences.addTheChildToGeofence(req.body.geofencesName, req.body.childsPhoneNumber);
//     var addedGeofenceToChildArray = await users.addGeofenceToChildArray(userId, req.body.geofencesName, req.body.childsPhoneNumber)
//     //add to User's Children Array
//     res.status(200).render("geofenceAdded", {});
// });

module.exports = router;


