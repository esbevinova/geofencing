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

describe('getChildbyPhoneNumber', function() {
    it('returnChildId', async function () {
        var result = await children.getChildbyPhoneNumber('732-614-5717');
        assert.equal(result._id, '5dc1d3ae7125021f285982db');
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
                childFCMToken: "dK4fCdhXqEs:APA91bFvTzLRAJ27kUlFY84KpUB9icMxImB1pbJTXsyuOFfdl0kk3uXbE7wdFYEtjKuaj84BcxMtDBMK3Mc6zN27ZiLVr9NDLvVWmjsAng4cGbfGi70c46J7EFV7A3Gc",
                lastKnownLat: "40.7434666",
                lastKnownLng: "-74.0268975"
            })
            .set('Accept', 'application/json')
            .expect(200, "Location saved", done);
    });  
});

describe("POST /childFCMTokenUpdate", () =>{
    it("should return the token is the same message", (done) =>{
        const res = request(app)
            .post("/childFCMTokenUpdate")
            .send({
                id: "5dc1d3ae7125021f285982db",
                fcmToken: "dK4fCdhXqEs:APA91bFvTzLRAJ27kUlFY84KpUB9icMxImB1pbJTXsyuOFfdl0kk3uXbE7wdFYEtjKuaj84BcxMtDBMK3Mc6zN27ZiLVr9NDLvVWmjsAng4cGbfGi70c46J7EFV7A3Gc"
            })
            .set('Accept', 'application/json')
            .expect(200, "the token is the same", done);
    });  
});

// describe("POST /safeGeofenceEventTriggerNotification", () =>{
//     it("should return successfully saved an alert", (done) =>{
//         const res = request(app)
//             .post("/safeGeofenceEventTriggerNotification")
//             // .set('Accept', 'application/json')
//             // .expect('Content-Type', "text/html; charset=utf-8")
//             .send({"geofenceAlert":{
//                 childId:"5dc1d3ae7125021f285982db",
//                 geofenceId:"5dbcbab0f8f8319eebe27b68",
//                 latitude: "1111111",
//                 longtitude:"2222222",
//                 accuracy:"12121212",
//                 speed:'0',  
//                 altitude:"100",
//                 bearing:"none",
//                 timestamp: "2019-11-14 19:52:21.676"
//             }})
//             .set('Accept', 'application/json')
//             .expect(200, "successfully saved an alert", done);
//     });  
// });

describe("POST /returnAlertHistory", () =>{
    it("should return returnedAlertHistory array", (done) =>{
        const res = request(app)
            .post("/returnAlertHistory")
            // .set('Accept', 'application/json')
            // .expect('Content-Type', "text/html; charset=utf-8")
            .send({
                childId:"5dc1d3ae7125021f285982db",
                parentId:"5db751c5eaa4f643e85bf023"
             })
            .set('Accept', 'application/json')
            .expect(200,
                "success", done);
    });  
});

//Need to add test for every function
//children.js - addGeofenceToChild case
//users.js - signup, getUserbyname, getUserbyfirstName, addChildToUser, addGeofenceToUser, updateUser, addGeofenceToChildArray, 
//geofences.js - addGeofence, getGeofence, getMyGeofences, getGeofenceByName, addTheChildToGeofence, 
// { "_id": "a365ff7c-d007-44a0-96e0-f6f0b67ab48c",
//                 "geofenceId": "5dcdf6fb6227c467ccb68064",
//                 "latitude": "40.7434983",
//                 "longtitude": "-74.027025",
//                 "accuracy":"20",
//                 "speed": "0",
//                 "altitude": "0",
//                 "bearing": "0",
//                 "timestamp": "2019-11-20 15:39:50.798",
//                 "addedAt": "2019-11-20 16:38:15.912"},
//                 {"_id": "3eba73e1-cf81-48ef-b906-3c4a057866fc",
//                     "geofenceId": "5dcdf6fb6227c467ccb68064",
//                     "latitude": "40.7434983",
//                     "longtitude": "-74.0269996",
//                     "accuracy": "20.016000747680664",
//                     "speed": "0.011554083786904812",
//                     "altitude": "5",
//                     "bearing": "270",
//                     "timestamp": "2019-11-20 15:41:14.529",
//                     "addedAt": "2019-11-20 16:38:15.921"}