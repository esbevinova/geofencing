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
        
        assert.equal(result.fcmToken, parentToken);
    });
});

//Need to add test for every function