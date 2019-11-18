const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const static = express.static(__dirname + "/public");
const session = require("express-session")
const configRoutes = require("./routes");
const data = require("./data");
const users = data.usersData;
const geofences = data.geofences
const { ObjectId } = require('mongodb');
const bcrypt = require("bcrypt")
const children = data.childrenData
const exphbs = require("express-handlebars");
const Handlebars = require("handlebars");
var path = require ("path");
const viewPath = path.join(__dirname, "/views");
var admin = require("firebase-admin");


var serviceAccount = require("./serviceAccountKey.json")


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://safe-child-8e016.firebaseio.com"
});


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
    
    res.json(child.geofences);
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

app.post("/parentFCMTokenUpdate", async (req, res) =>{
  try{
      var parentFcmToken = req.body.fcmToken
      var parent_id = req.body.id
      //var oldFCMToken = req.body.oldFCMToken
      //check the received id and old and new token ID. If  
      
      const foundUser = await users.get(parent_id)//if old tokens match, then execute the rest of the code
     
      if (foundUser != null && (foundUser.fcmToken === "" || foundUser.fcmToken != parentFcmToken)){
  
        //find and update fcmToken
        var parsed_parent_id = ObjectId(parent_id)
        var foundParent = await users.updateParentFCMToken(parsed_parent_id, parentFcmToken)
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

//checking the FCM Token for child
app.post("/childFCMTokenUpdate", async (req, res) =>{
  try{
    var childFcmToken = req.body.fcmToken
    var child_id = req.body.id

    const foundChild = await children.get(child_id)//if old tokens match, then execute the rest of the code
    

    if (foundChild != null && (foundChild.fcmToken === "" || foundChild.fcmToken != childFcmToken)){
      var parsed_child_id = ObjectId(child_id)
      var foundChildToken = await children.updateChildFCMToken(parsed_child_id, childFcmToken)
      res.send("Successfully updated child's FCM Token")
    }
    else{
      res.send("the token is the same")
    }
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
      res.send(childResult._id.toString())
      return;
    }else{
      res.send("fail")
    }
    
  } catch (e) {
    console.log(e)
    res.send("fail");
  }
});

// update the child record by inserting lastKnownLat, lastKnownLng
app.post("/childLocationUpdate", async (req, res) => {
  try {
    var child_id = req.body.id
    let parsedId = ObjectId(child_id)
    var receivedFCMToken = req.body.childFCMToken
    var findChild = await children.get(parsedId)
    var existingFCMToken = findChild.fcmToken
    var child_lastKnownLat = req.body.lastKnownLat
    var child_lastKnownLng = req.body.lastKnownLng

    if(receivedFCMToken == existingFCMToken){
        const result = await children.updateChild(parsedId, child_lastKnownLat, child_lastKnownLng)
        if( result === null){
          res.send("fail")
        }
        res.send("Location saved")
    } else{
      res.send("authentication failed")
    }
    
  } catch (e) {
    console.log(e)
    res.send("fail");
  }
});

app.post("/sendLastKnownLocationToParent", async (req, res) =>{
  try{
    const receivedChildId = req.body.childId //receive child ID
    const receivedParentId = req.body.parentId //receive parent ID
    const found_child = await children.get(receivedChildId) //find the child in children collection
    const parentIdFound = found_child.parentId //get parent Id from the found child
    if (parentIdFound == receivedParentId){
      const lastKnownLatFound = found_child.lastKnownLat
      const lastKnownLngFound = found_child.lastKnownLng
      const convertedLastKnownLng = parseFloat(lastKnownLngFound)
      const convertedLastKnownLat = parseFloat(lastKnownLatFound)
      // res.json({"lastknownLng": convertedLastKnownLng, "lastKnownLat": convertedLastKnownLat})
      var convertedCoordinates = {};
      convertedCoordinates["lastKnownLat"] = convertedLastKnownLat;
      convertedCoordinates["lastKnownLng"] = convertedLastKnownLng
      res.json(convertedCoordinates)
    } else {
      res.send("not a parent")
    }
  }catch(e){
    console.log(e)
    res.send("fail")
  }
})

//safe the geofence trigger alert
app.post("/safeGeofenceEventTriggerNotification", async (req, res) => {
  try{
    var receivedJson = req.body.geofenceAlert//NEED TO CHECK WHAT IM RECEIVING
    parsedJson = JSON.parse(receivedJson);

    var child_id = parsedJson.childId
    var geofence_id = parsedJson.geofenceId
    var latitude = parsedJson.latitude
    var longtitude = parsedJson.longtitude
    var accuracy = parsedJson.accuracy
    var speed = parsedJson.speed
    var altitude = parsedJson.altitude
    var bearing = parsedJson.bearing
    var timestamp = parsedJson.timestamp
    var convertedTimestamp = Math.round(new Date(timestamp).getTime()/1000)

    // var child_id = req.body.childId
    // var geofence_id = req.body.geofenceId
    // var latitude = req.body.latitude
    // var longtitude = req.body.longtitude
    // var accuracy = req.body.accuracy
    // var speed = req.body.speed
    // var altitude = req.body.altitude
    // var bearing = req.body.bearing
    // var timestamp = req.body.timestamp

    const savedAlert = await children.addGeofenceAlerts(child_id, geofence_id, latitude, longtitude, accuracy, speed, altitude, bearing, convertedTimestamp)
    res.send("successfully saved an alert")
  } catch (e){
    console.log(e)
    res.send("fail")
  }
});


//return last 50 alerts as a json
app.post("/returnAlertHistory", async (req, res) => {
  try{
    const receivedChildId = req.body.childId
    const parsedReceivedChildId = ObjectId(receivedChildId)
    const receivedParentId = req.body.parentId
    const childFound = await children.get(receivedChildId) //find the child in children collection
    const parentIdFound = found_child.parentId //get parent Id from the found child
    
    if (parentIdFound == receivedParentId){

      // const foundAlerts = await children.find( { _id: parsedReceivedChildId }, { geofences: {$slice: 50 } } );
      // res.json(foundAlerts)
      const returnedAlertHistory = await children.aggregate(
              { $match: {
                  _id : parsedReceivedChildId
              }},
              // Expand the scores array into a stream of documents
              { $unwind: '$geofences' },
              // Sort in descending order
              { $sort: {
                  'geofences.timestamp': -1
              }},
              { $limit : 50 }
          )
      res.json(returnedAlertHistory)
    } else {
      res.send("not a parent")
    }
  } catch (e){
    console.log(e)
    res.send("fail")
  }
});

//Notification Post Request
app.post("/geofenceEventTriggerNotification", async (req, res) => {
  try{
    child_id = req.body.id //get child Id
    //Save and convert the date
    // const eventDate = req.body.timestamp
    // const convertedEventDate = Math.round(new Date(eventDate).getTime()/1000)
    const found_child = await children.get(child_id) //find the child in children collection
    const parentIdFound = found_child.parentId //get parent Id from the found child
    const findParent= await users.get(parentIdFound) //find parent in users collection
    const foundFCMToken = findParent.fcmToken //get token from the found parent
    
    //add timestamp conversion
    //add a check if fcm token exists or not
    if (foundFCMToken != "" || foundFCMToken != null){

        geofence_id = req.body.geofenceId //get geofence ID
        const found_geofence = await geofences.get(geofence_id)  //find geofence in geofence collection

        const payload = {
          notification: {
            title: 'Geofence ' + found_geofence.geofenceName + ' Triggered',
            body: found_child.firstN + " has crossed " + found_geofence.geofenceName + ' geofence.'
          }
        }

        const options = {
          priority: 'high',
          timeToLive: 60 * 60 * 24, // 1 day
        };
        
        admin.messaging().sendToDevice(foundFCMToken, payload, options);
    } else{
      res.send("no FCM token is registered")
    }
  }catch(e){
    console.log(e)
    res.send("fail")
  }
 
});


//Notification Post Request for Child
app.post("/childLocationRequestNotification", async (req, res) => {
  try{
    const receivedChildId = req.body.id //get child Id
    const receivedParentId = req.body.parentId
    const receivedMessage = req.body.task
    const found_child = await children.get(receivedChildId) //find the child in children collection
    const foundChildFCMToken = found_child.fcmToken
    const parentIdFound = found_child.parentId //get parent Id from the found child
    
    if (parentIdFound == receivedParentId){
        //Do I need to check old and new fcmtoken?
        const payload = {
          notification: {
            title: "location_request",
            body: receivedMessage
          }
        }

        const options = {
          priority: 'high',
          timeToLive: 60 * 60 * 24, // 1 day
        };
        
        admin.messaging().sendToDevice(foundChildFCMToken, payload, options);
        res.send(receivedMessage)
      } else{
        res.send("fail")
      }
    }catch (e){
      console.log(e)
      res.send("fail")
    }
});


configRoutes(app);


app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
