var assert = require('assert');
const data = require("../data");
const expect = require('chai').expect; //option 1
const request = require('supertest')//option 2
const app = require('../app');//option 2
var users = data.usersData;
var children = data.childrenData


describe('findUserByEmail', function() {
    it('returnsUserId', async function () {
        var result = await users.getUserbyfirstName('kat@gmail.com');
        assert.equal(result, '5db751c5eaa4f643e85bf023');
    });
});

describe('getChildbyPhoneNumber', function() {
    it('returnChildId', async function () {
        var result = await children.getChildbyPhoneNumber('732-614-5717');
        assert.equal(result._id, '5dc1d3ae7125021f285982db');
    });
});

// //
// describe('updateChildFCMtoken', function() {
//     it('returnOnSuccess', async function () {
//         child_id = "5dc1d3ae7125021f285982db"
//         childToken = "dK4fCdhXqEs:APA91bFvTzLRAJ27kUlFY84KpUB9icMxImB1pbJTXsyuOFfdl0kk3uXbE7wdFYEtjKuaj84BcxMtDBMK3Mc6zN27ZiLVr9NDLvVWmjsAng4cGbfGi70c46J7EFV7A3Gc-w7JcK9dpVor"
//         var result = await children.updateChildFCMToken(child_id, childToken);
        
//         assert.equal(result.fcmToken, childToken);
//     });
// });

// describe('safeGeofenceAlerts', function() {
//     it('returnOnSuccess', async function () {
//         child_id = "5dc1d3ae7125021f285982db"
//         geofence_id = "5dbcbab0f8f8319eebe27b68"
//         latitude = "40.1708061"
//         longtitude = "-74.2355633"
//         accuracy = "10 feet"
//         speed = "12"
//         altitude = "??"
//         bearing = "?"
//         timestamp = "?"
//         var result = await children.addGeofenceAlerts(child_id, geofence_id, latitude, longtitude, accuracy, speed, altitude, bearing, timestamp);
        
//         assert.equal(result.fcmToken, parentToken);
//     });
// });

describe("POST /parentData", () =>{
    it("should return parent when the request body is valid", async () => {
        const res = await request(app)
            .post("/parentData")
            .send({
                id: "5db751c5eaa4f643e85bf023",
            });

        expect(res.body).to.have.property("_id");
    });
})

describe("POST /childData", () =>{
    it("should return child's geofences when the request body is valid", async () => {
        const res = await request(app)
            .post("/childData")
            .send({
                id: "5dc1d3ae7125021f285982db",
            });
            

        // expect(res.status).to.equal(200)
        expect(res.body).to.be.an.instanceof(Array).and.to.have.property(0)
        .that.includes.all.keys(["geofenceId", "geofenceName", "formattedAddress", "lat", "lng", "radius", "CreatedAt"])
        //add more tests here
    });
})

describe("POST /authenticateParent", () =>{
    it("should return id of a parent if body is valid",(done) =>{
        const res = request(app)
            .post("/authenticateParent")
            // .set('Accept', 'application/json')
            // .expect('Content-Type', "text/html; charset=utf-8")
            .send({
                username: "kat",
                password: "kat",
            })
            .set('Accept', 'application/json')
            .expect(function(res) {
                res.body.id = '5db751c5eaa4f643e85bf023';
            })
            .expect(200, {
                id: '5db751c5eaa4f643e85bf023'
            }, done);
        //https://github.com/visionmedia/supertest
        
        // expect(res.status).to.equal(200)
        // res.body.should.be.a('string');
        // expect(res.body).to.have.property("5db751c5eaa4f643e85bf023");
        // expect(res.body).to.be.an.instanceof(Object).and.to.have.property("5db751c5eaa4f643e85bf023")
        // expect(res.body).to.have.property
    });  
});

describe("POST /authenticateChild", () =>{
    it("should return id of a child if body is valid", (done) =>{
        const res = request(app)
            .post("/authenticateChild")
            // .set('Accept', 'application/json')
            // .expect('Content-Type', "text/html; charset=utf-8")
            .send({
                username: "kat",
                password: "kat",
                childPhoneNumber: "732-614-5717"
            })
            .set('Accept', 'application/json')
            .expect(200,'5dc1d3ae7125021f285982db', done);
    });  
});

describe("POST /childLocationUpdate", () =>{
    it("should return id of a child if body is valid", (done) =>{
        const res = request(app)
            .post("/childLocationUpdate")
            .send({
                id: "5dc1d3ae7125021f285982db",
                childFCMToken: "dK4fCdhXqEs:APA91bFvTzLRAJ27kUlFY84KpUB9icMxImB1pbJTXsyuOFfdl0kk3uXbE7wdFYEtjKuaj84BcxMtDBMK3Mc6zN27ZiLVr9NDLvVWmjsAng4cGbfGi70c46J7EFV7A3Gc-w7JcK9dpVor",
                lastKnownLat: "40.7434666",
                lastKnownLng: "-74.0268975"
            })
            .set('Accept', 'application/json')
            .expect(200, "Location saved", done);
    });  
});

//tests updateParentFCMtoken function
describe("POST /parentFCMTokenUpdate", () =>{
    it("should return ", (done) =>{
        const res = request(app)
            .post("/parentFCMTokenUpdate")
            .send({
                id: "5dc355779443a5432c379bc7",
                fcmToken: "dK4fCdhXqEs:APA91bFvTzLRAJ27kUlFY84KpUB9icMxImB1pbJTXsyuOFfdl0kk3uXbE7wdFYEtjKuaj84BcxMtDBMK3Mc6zN27ZiLVr9NDLvVWmjsAng4cGbfGi70c46J7EFV7A3Gc-w7JcK9dpVor"
            })
            .set('Accept', 'application/json')
            .expect(200, "the token is the same", done);
    });  
});


describe("POST /safeGeofenceEventTriggerNotification", () =>{
    it("should return successfully saved an alert", (done) =>{
        const res = request(app)
            .post("/safeGeofenceEventTriggerNotification")
            // .set('Accept', 'application/json')
            // .expect('Content-Type', "text/html; charset=utf-8")
            .send({"geofenceAlert":{
                childId:"5dc1d3ae7125021f285982db",
                geofenceId:"5dbcbab0f8f8319eebe27b68",
                latitude: "1111111",
                longtitude:"2222222",
                accuracy:"12121212",
                speed:'0',  
                altitude:"100",
                bearing:"none",
                timestamp: "2019-11-14 19:52:21.676"
            }})
            .set('Accept', 'application/json')
            .expect(200, "successfully saved an alert", done);
    });  
});


// app.post("/safeGeofenceEventTriggerNotification", async (req, res) => {
//     try{
//       var receivedJson = req.body.geofenceAlert//NEED TO CHECK WHAT IM RECEIVING
//       parsedJson = JSON.parse(receivedJson);
  
//       var child_id = parsedJson.childId
//       var geofence_id = parsedJson.geofenceId
//       var latitude = parsedJson.latitude
//       var longtitude = parsedJson.longtitude
//       var accuracy = parsedJson.accuracy
//       var speed = parsedJson.speed
//       var altitude = parsedJson.altitude
//       var bearing = parsedJson.bearing
//       var timestamp = parsedJson.timestamp
//       var convertedTimestamp = Math.round(new Date(timestamp).getTime()/1000)
  
//       // var child_id = req.body.childId
//       // var geofence_id = req.body.geofenceId
//       // var latitude = req.body.latitude
//       // var longtitude = req.body.longtitude
//       // var accuracy = req.body.accuracy
//       // var speed = req.body.speed
//       // var altitude = req.body.altitude
//       // var bearing = req.body.bearing
//       // var timestamp = req.body.timestamp
  
//       const savedAlert = await children.addGeofenceAlerts(child_id, geofence_id, latitude, longtitude, accuracy, speed, altitude, bearing, convertedTimestamp)
//       res.send("successfully saved an alert")
//     } catch (e){
//       console.log(e)
//       res.send("fail")
//     }
//   });

//Need to add test for every function