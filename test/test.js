var assert = require('assert');
const data = require("../data");
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

//tests updateParentFCMtoken function
describe('updateparentFCMtoken', function() {
    it('returnOnSuccess', async function () {
        parent_id = "5dc355779443a5432c379bc7"
        parentToken = "dK4fCdhXqEs:APA91bFvTzLRAJ27kUlFY84KpUB9icMxImB1pbJTXsyuOFfdl0kk3uXbE7wdFYEtjKuaj84BcxMtDBMK3Mc6zN27ZiLVr9NDLvVWmjsAng4cGbfGi70c46J7EFV7A3Gc-w7JcK9dpVor"
        var result = await users.updateParentFCMToken(parent_id, parentToken);
        
        assert.equal(result.fcmToken, parentToken);
    });
});

//
describe('updateChildFCMtoken', function() {
    it('returnOnSuccess', async function () {
        child_id = "5dc1d3ae7125021f285982db"
        childToken = "dK4fCdhXqEs:APA91bFvTzLRAJ27kUlFY84KpUB9icMxImB1pbJTXsyuOFfdl0kk3uXbE7wdFYEtjKuaj84BcxMtDBMK3Mc6zN27ZiLVr9NDLvVWmjsAng4cGbfGi70c46J7EFV7A3Gc-w7JcK9dpVor"
        var result = await children.updateChildFCMToken(child_id, childToken);
        
        assert.equal(result.fcmToken, childToken);
    });
});

describe('safeGeofenceAlerts', function() {
    it('returnOnSuccess', async function () {
        child_id = "5dc1d3ae7125021f285982db"
        geofence_id = "5dbcbab0f8f8319eebe27b68"
        latitude = "40.1708061"
        longtitude = "-74.2355633"
        accuracy = "10 feet"
        speed = "12"
        altitude = "??"
        bearing = "?"
        timestamp = "?"
        var result = await children.addGeofenceAlerts(child_id, geofence_id, latitude, longtitude, accuracy, speed, altitude, bearing, timestamp);
        
        assert.equal(result.fcmToken, parentToken);
    });
});


//Need to add test for every function