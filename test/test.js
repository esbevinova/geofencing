var assert = require('assert');
const data = require("../data");
const expect = require('chai').expect; //option 1
const request = require('supertest')//option 2
const app = require('../app');//option 2
var users = data.usersData;
var children = data.childrenData
var geofences = data.geofences


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
                id: "5db751c5eaa4f643e85bf023",
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

/*
describe('addGeofenceAlerts', function(){
    it('return added alert', async function () {
        var result = await children.addGeofenceAlerts("a365ff7c-d007-44a0-96e0-f6f0b67ab48c", "5dbf91eb64f20be36858fbc2", "5dcdf6fb6227c467ccb68064", 40.7434983, -74.027025, 
        20, 0, 100, 100, "2019-11-20 15:39:50.798")
        assert.equal(result, "updated")
    })
})
*/

describe('getMyChildren', function(){
    it('all the children', async function () {
        var result = await children.getMyChildren('5db751c5eaa4f643e85bf023')
        assert.equal(result, '')
    })
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
                '[{"_id":"84fb54b3-c81e-4cd9-ba84-a31267986057","geofenceId":"5dcdf6fb6227c467ccb68064","geofenceName":"School","latitude":40.7434983,"longtitude":-74.027,"accuracy":20,"speed":0,"altitude":0,"bearing":0,"timestamp":"2019-11-22T00:23:30.811Z","addedAt":"2019-11-22T00:36:28.219Z"},{"_id":"cc4070f9-d740-4f4a-a5b3-ac8871a5a68c","geofenceId":"5dcdf6fb6227c467ccb68064","geofenceName":"School","latitude":40.7434983,"longtitude":-74.027,"accuracy":20,"speed":0,"altitude":0,"bearing":0,"timestamp":"2019-11-22T00:29:03.409Z","addedAt":"2019-11-22T00:36:28.232Z"},{"_id":"11cf5c72-42ed-42a6-8887-1b3f120a8ab1","geofenceId":"5dcdf6fb6227c467ccb68064","geofenceName":"School","latitude":40.7434983,"longtitude":-74.027,"accuracy":20,"speed":0,"altitude":0,"bearing":0,"timestamp":"2019-11-22T00:31:01.115Z","addedAt":"2019-11-22T00:36:28.243Z"},{"_id":"0c7b26d9-d2b4-4a5d-8eed-616ad940c2fc","geofenceId":"5dcdf6fb6227c467ccb68064","geofenceName":"School","latitude":40.7434983,"longtitude":-74.027,"accuracy":20,"speed":0,"altitude":0,"bearing":0,"timestamp":"2019-11-22T00:32:09.123Z","addedAt":"2019-11-22T00:36:28.253Z"},{"_id":"4a1f93c6-6630-4e21-a2fa-410f30a46ccd","geofenceId":"5dcdf6fb6227c467ccb68064","geofenceName":"Home","latitude":40.7434983,"longtitude":-74.027,"accuracy":20,"speed":0,"altitude":0,"bearing":0,"timestamp":"2019-11-22T00:36:26.562Z","addedAt":"2019-11-22T00:36:28.267Z"}]', done);
    });  
});

describe("POST /allChildren", () =>{
    it("should return first names and ids of children of the parent array", (done) =>{
        const res = request(app)
            .post("/allChildren")
            .send({
                parentId:"5db751c5eaa4f643e85bf023",
                fcmToken:"dK4fCdhXqEs:APA91bFvTzLRAJ27kUlFY84KpUB9icMxImB1pbJTXsyuOFfdl0kk3uXbE7wdFYEtjKuaj84BcxMtDBMK3Mc6zN27ZiLVr9NDLvVWmjsAng4cGbfGi70c46J7EFV7A3Gc-w7JcK9dpVor"
             })
            .set('Accept', 'application/json')
            .expect(200,
                '[{"id":"5dbf91eb64f20be36858fbc2","name":"georgey"},{"id":"5dc1d3ae7125021f285982db","name":"Morticia"}]', done);
    });  
});

//need to work on it more!!!!!!!!!!!!!!!!!!!!!!!!!
describe("POST /saveGeofenceEventToServer", () =>{
    it("should return array", (done) =>{
        const res = request(app)
            .post("/saveGeofenceEventToServer")
            // .set('Accept', 'application/json')
            // .expect('Content-Type', "text/html; charset=utf-8")
            .send({
                childId:"5dc1d3ae7125021f285982db",
                parentId:"5db751c5eaa4f643e85bf023"
             })
            .set('Accept', 'application/json')
            .expect(200,
                '', done);
    });  
});


describe("POST /sendLastKnownLocationToParent", () =>{
    it("should sendLastKnownLocationToParent", (done) =>{
        const res = request(app)
            .post("/sendLastKnownLocationToParent")
            .send({
                childId:"5dc1d3ae7125021f285982db",
                parentId:"5db751c5eaa4f643e85bf023"
             })
            .set('Accept', 'application/json')
            .expect(200,
                '{"lastKnownLat":40.7434666,"lastKnownLng":-74.0268975}' , done);
    });  
});

describe('getGeofence', function() {
    it('returns geofence', async function () {
        var result = await geofences.getGeofence('5dbcbab0f8f8319eebe27b68');
        assert.equal(result._id, '5dbcbab0f8f8319eebe27b68');
    });
});

//failing
describe('getMyGeofences', function() {
    it('getMyGeofences', async function () {
        var result = await geofences.getMyGeofences("5db751c5eaa4f643e85bf023");
        assert.equal(result, '');
    });
});

describe('getGeofenceByName', function() {
    it('getGeofenceByName', async function () {
        var result = await geofences.getGeofenceByName("Home");
        assert.equal(result._id, '5dbcbab0f8f8319eebe27b68');
    });
});

describe('getParent', function() {
    it('getParent', async function () {
        var result = await users.get("5db751c5eaa4f643e85bf023");
        assert.equal(result._id, '5db751c5eaa4f643e85bf023');
    });
});

//Need to add test for every function
