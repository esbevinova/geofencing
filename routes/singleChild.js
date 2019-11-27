const express = require("express");
const router = express.Router();
const data = require("../data");
const users = data.usersData;
const children = data.childrenData;



router.post("/", async (req, res) => {
    if(req.session.authority == true)
    {
        var userID = req.session.userID;
        var userResult = await users.get(userID);
        if(userResult == null){
            userResult = ["None"]
        }
    
    
    res.status(200).render("singleChild",
    {
        userResult : userResult,
        myChild : myChild
    })
    
    return  
    }
    
    res.status(401).render('errorPage', { e: { statusCode: "401", error: "You are not logged in, please login", redirect: "/" } })
});


router.get('/:id', async (req, res) => {
    if(req.session.authority == true)
    {
    const { id } = req.params;
    var myChild = await children.get(id);
    console.log(myChild.geofences)
    var myGeofences = myChild.geofences
    var alerts = myChild.alerts

    //var myGeofences = await geofences.getMyGeofences(userID);
    //return res.send(`<h1>${id}</h1>`);
    res.status(200).render("singleChild",
    {
        myChild : myChild,
        myGeofences : myGeofences,
        alerts : alerts
    })
    return
}
    
res.status(401).render('errorPage', { e: { statusCode: "401", error: "You are not logged in, please login", redirect: "/" } })
});

router.get('/:id/json', async (req, res) => {
    if (req.session.authority) {
        const { id } = req.params;
        const myChild = await children.get(id);
        const myGeofences = myChild.geofences;
        const alerts = myChild.alerts

        return res.status(200).json({ myChild, myGeofences, alerts });
    }
})



module.exports = router;