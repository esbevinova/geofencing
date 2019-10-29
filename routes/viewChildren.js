const express = require("express");
const router = express.Router();
const data = require("../data");
const users = data.usersData;
const geofences = data.geofences;
const children = data.childrenData
const xss = require ('xss');

router.get("/", async (req, res) => {
    if(req.session.authority == true)
    {
        var userID = req.session.userID;
        var userResult = await users.get(userID);
        console.log(userResult)
        
        if(userResult == null){
            userResult = ["None"]
        }
        res.status(200).render("viewChildren",
        {
            userResult : userResult
        })
        return
    }
    res.status(401).render('errorPage', { e: { statusCode: "401", error: "You are not logged in, please login", redirect: "/" } })
  });


  router.get("/:id", async (req, res) => {
    try {
      const child = await children.get(req.params.id);
      res.json(child);
    } catch (e) {
      res.status(404).json({ error: "Child not found" });
    }
  });

  module.exports = router;

