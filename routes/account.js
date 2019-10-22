const express = require("express");
const router = express.Router();
const data = require("../data");
const users = data.usersData;
const children = data.childrenData

router.get("/", async (req, res) => {
    if(req.session.authority == true)
    {
        var userID = req.session.userID;
        var userResult = await users.get(userID);
        console.log(userResult)
        if(userResult == null){
            userResult = ["None"]
        }
        res.status(200).render("account",
        {
            userResult : userResult
        })
        return
    }
    res.status(401).render('errorPage', { e: { statusCode: "401", error: "You are not logged in, please login", redirect: "/" } })
  });
  router.post("/", async (req, res) => {
      try{
        const currentUser = req.session.userID;
        const childData = req.body;
        if(typeof(req.body.firstN) !== "string"){
            res.status(400).json({message : "NO FIRST NAME"})
          }
          if(typeof(req.body.lastN) !== "string"){
            res.status(400).json({message : "NO LAST NAME"})
          }
        var createdChild = await children.addChild(currentUser, childData.firstN, childData.lastN, childData.childPhoneNumber);
        console.log(createdChild)
        //var childId = await createdChild._id 
        var addChildToParent = await users.addChildToUser(req.session.userID, createdChild._id, createdChild.firstN, createdChild.lastN, createdChild.childPhoneNumber)
        //var updatedUserr = users.updateUser(currentUser, createdChild)

        res.redirect('/childAdded');//need to add where to redirect after child is added
      }
      catch(error)
        {
        res.status(404).json({message:error})
        }
  });

module.exports = router;
  