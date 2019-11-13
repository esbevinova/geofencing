var assert = require('assert');
const data = require("../data");
var users = data.usersData;


describe('findUserByEmail', function() {
    it('returnsUserId', async function () {
        var result = await users.getUserbyfirstName('kat@gmail.com');
        assert.equal(result, '5db751c5eaa4f643e85bf023');
    });
});

//Need to add test for every function