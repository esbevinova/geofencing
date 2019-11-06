const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const static = express.static(__dirname + "/public");
const session = require("express-session")
const configRoutes = require("./routes");
const data = require("./data");
const users = data.usersData;
const { ObjectId } = require('mongodb');
const bcrypt = require("bcrypt")
const children = data.childrenData
const exphbs = require("express-handlebars");
const Handlebars = require("handlebars");
var path = require ("path");
const viewPath = path.join(__dirname, "/views");


const handlebarsInstance = exphbs.create({
  defaultLayout: "main",
  // Specify helpers which are only registered on this instance.
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === "number")
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

      return new Handlebars.SafeString(JSON.stringify(obj));
    }
  }
});

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }
  // let the next middleware run:
  next();
};

app.use("/public", static);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);
app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");
app.set("views", viewPath);

app.use(session({
  name: "AuthCookie",
  secret: "Project",
  resave: false,
  saveUninitialized: true

}))

//Post Requests for Mobile Application

//returns parent's information
app.post("/parentData", async (req, res) => {
  try {
    var user_id = req.body.id
    console.log(user_id)
    let parsedId = ObjectId(user_id)
    console.log(parsedId)

    const parent = await users.get(parsedId);
    
    res.json(parent);
  } catch (e) {
    console.log(e)
    res.send("fail");
  }
});

//returns child's information
app.post("/childData", async (req, res) => {
  try {
    var child_id = req.body.id
    let parsedId = ObjectId(child_id)

    const child = await children.get(parsedId);
    
    res.json(child);
  } catch (e) {
    console.log(e)
    res.send("fail");
  }
});

//authenticates parent
app.post("/authenticateParent", async (req, res) => {
  try {
    var parent_username = req.body.username
    var parent_password = req.body.password
    const result = await users.getUserbyname(parent_username)
    if( result === null){
      res.send("fail")
    }
    const compareResult = await bcrypt.compare(parent_password,result.password);
    if(result != null && compareResult==true){
      req.session.userName = result.username
      stringied_id = result._id.toString()
      res.send(stringied_id)
      return;
    }else{
      res.send("fail")
    }
  } catch (e) {
    console.log(e)
    res.send("fail");
  }
});

//authenticates child by checking username, password, phone number
app.post("/authenticateChild", async (req, res) => {
  try {
    var parent_username = req.body.username
    var parent_password = req.body.password
    var child_phoneNumber = req.body.childPhoneNumber
    const result = await users.getUserbyname(parent_username)
    if( result === null){
      res.send("fail")
    }
    const childResult = await children.getChildbyPhoneNumber(child_phoneNumber)
    if (result === null){
      res.send("fail")
    }
    const compareResult = await bcrypt.compare(parent_password, result.password);
    if(result != null && childResult != null && compareResult==true && child_phoneNumber==childResult.childPhoneNumber){
      req.session.userName = result.username
      res.send(childResult._id)
      return;
    }else{
      res.send("fail")
    }
    
  } catch (e) {
    console.log(e)
    res.send("fail");
  }
});


/*Create post request /childDeviceUpdate
  Find child in the collection by provided i
  update the child record by inserting lastKnownLat, lastKnownLng, fcmToken (need to check if fcm should be updated separately)
*/

app.post("/childDeviceUpdate", async (req, res) => {
  try {
    var child_id = req.body.id
    let parsedId = ObjectId(child_id)
    var child_lastKnownLat = req.body.lastKnownLat
    var child_lastKnownLng = req.body.lastKnownLng
    var child_fcmToken = req.body.fcmToken
    const result = await children.updateChild(id, childId, lastKnownLat, lastKnownLng, fcmToken)
    if( result === null){
      res.send("fail")
    }
    
  } catch (e) {
    console.log(e)
    res.send("fail");
  }
});

/*create post request /parentDeviceUpdate
  to update fcmToken field in the parent's document in Mongodb
*/

configRoutes(app);


app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
