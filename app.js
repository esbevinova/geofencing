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
<<<<<<< HEAD
const bootstrap = require('bootstrap'); 
=======
>>>>>>> c02bba47e52f95470dd7dc125fe94482bad7d08d
var path = require ("path");
const viewPath = path.join(__dirname, "/views");
var admin = require("firebase-admin");


var serviceAccount = require("./serviceAccountKey.json")


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://safe-child-8e016.firebaseio.com"
});
<<<<<<< HEAD


=======
>>>>>>> c02bba47e52f95470dd7dc125fe94482bad7d08d


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

//separate POST request for just fcmToken
app.post("/parentFCMTokenUpdate", async (req, res) =>{
  try{
      var parentFcmToken = req.body.fcmToken
      var parent_id = req.body.id
      //find and update fcmToken
      var foundUser = await users.updateParentFCMToken(parent_id, parentFcmToken)
      res.send("Successfully updated parent's FCM Token: " + parent_id)

  }catch (e){
    console.log(e)
    res.send("fail")
  }
})

// /parentFCMTokenUpdate and /childFCMTokenUpdate were failing because the existing token was the same as the one that was passed.
//might have to create a separate post request that checks FCMToken and if differ from the one saved, THEN send post request to update it.
//need to verify if the fcmToken is passed always different or we have to check internally? If we need to check then, pass the comparison into the updateParentFCMToken() function
//separate POST request for just fcmToken
app.post("/parentFCMTokenUpdate", async (req, res) =>{
  try{
      var parentFcmToken = req.body.fcmToken
      var parent_id = req.body.id
      foundUser = await users.get(parent_id)
      if (foundUser.fcmToken != Null || foundUser.fcmToken != parentFcmToken){
        //find and update fcmToken
        var foundUser = await users.updateParentFCMToken(parent_id, parentFcmToken)
        res.send("Successfully updated parent's FCM Token")
      }
      else{
        res.send("the token is the same")
      }

  }catch (e){
    console.log(e)
    res.send("fail")
  }
});

app.post("./childFCMTokenUpdate", async (req, res) =>{
  try{
    var childFcmToken = req.body.fcmToken
    var child_id = req.body.id
    var foundChild = await children.updateChildFCMToken(child_id, childFcmToken)
    res.send("Successfully updated child's FCM Token: " + child_id)
  } catch (e){
    console.log(e)
    res.send("fail")
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

// Find child in the collection by provided id
// update the child record by inserting lastKnownLat, lastKnownLng
app.post("/childLocationUpdate", async (req, res) => {
  try {
    var child_id = req.body.id
    let parsedId = ObjectId(child_id)
    var child_lastKnownLat = req.body.lastKnownLat
    var child_lastKnownLng = req.body.lastKnownLng
  
    const result = await children.updateChild(parsedId, child_lastKnownLat, child_lastKnownLng)
    if( result === null){
      res.send("fail")
    }
    
  } catch (e) {
    console.log(e)
    res.send("fail");
  }
});

<<<<<<< HEAD
/*Create post request /childDeviceUpdate
  Find child in the collection by provided i
  update the child record by inserting lastKnownLat, lastKnownLng, fcmToken (need to check if fcm should be updated separately)
*/

app.post("/childLocationUpdate", async (req, res) => {
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
// app.post("/parentTokenUpdate", async (req, res) => {
//   try {
//     // var child_id = req.body.id
//     // let parsedId = ObjectId(child_id)
//     // var child_lastKnownLat = req.body.lastKnownLat
//     // var child_lastKnownLng = req.body.lastKnownLng
//     // var child_fcmToken = req.body.fcmToken
//     // const result = await children.updateChild(id, childId, lastKnownLat, lastKnownLng, fcmToken)
//     var parent_id = req.body.id
//     let parsedId = ObjectId(parent_id)
//     var last_known_token = req.body.fcmToken
//     var found_parent = users.findOne(parsedId)

//     if ()
//     if( result === null){
//       res.send("fail")
//     }
    
//   } catch (e) {
//     console.log(e)
//     res.send("fail");
//   }
// });


//Notification Post Request
app.post("/geofenceEventTriggerNotification", async (req, res) => {
  //ashish will send child and geofence ids, and then i'll have all the information that i can display 
  //child_id = req.body.id
  //geofence_id = req.body.
  const payload = {
    notification: {
      title: 'Geofence Triggered',
      body: 'AHAHAHAHAHAHAHAHAHA'
=======
//POST REQUEST SAFE EVENT GEOFENCE DATA
//save notifications under each child - childId, geofenceId
//latitude, longitude, accuracy, speed, altitude, bearing, timestamp, id
app.post("/safeGeofenceEventTriggerNotification", async (req, res) => {
  try{
    var child_id = req.body.childId
    var geofence_id = req.body.geofenceId
    var latitude = req.body.latitude
    var longtitude = req.body.longtitude
    var accuracy = req.body.accuracy
    var speed = req.body.speed
    var altitude = req.body.altitude
    var bearing = req.body.bearing
    var timestamp = req.body.timestamp

    const savedAlert = await children.addGeofenceAlerts(child_id, geofence_id, latitude, longtitude, accuracy, speed, altitude, bearing, timestamp)
    res.send("successfully saved an alert")
  } catch (e){
    console.log(e)
    res.send("fail")
  }
})

//Notification Post Request
app.post("/geofenceEventTriggerNotification", async (req, res) => {
  //ashish will send child and geofence ids
  child_id = req.body.id
  found_child = children.get(child_id)

  geofence_id = req.body.geofenceId
  found_geofence = geofences.get(geofence_id) 

  const payload = {
    notification: {
      title: 'Geofence' + found_geofence.geofenceName + 'Triggered',
      body: found_child.name + "has crossed" + found_geofence.geofenceName + 'geofence.'
>>>>>>> c02bba47e52f95470dd7dc125fe94482bad7d08d
    }
  }

  const options = {
    priority: 'high',
    timeToLive: 60 * 60 * 24, // 1 day
  };
  const firebaseToken = 'fjOUmPdab48:APA91bG2Ykz_PXKHVM-oxZ9iGj_DpWAhVQ-cfJ_A94LzbkxDK4frv5bmvaVrYa31-B4v4mhiJt3UsR8EVqEGBduHjKF3iBAKUXMp5WJcg5MbGF-1PZQF2M8-tJxzWQClOk-3rzkTNhWJ'
  admin.messaging().sendToDevice(firebaseToken, payload, options);
 
});

configRoutes(app);


app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
