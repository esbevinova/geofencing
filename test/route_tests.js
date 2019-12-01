var assert = require('assert');
const data = require("../data");
const expect = require('chai').expect; //option 1
const request = require('supertest')//option 2
const app = require('../app');//option 2
var users = data.usersData;
var children = data.childrenData
var geofences = data.geofences
var session = require('supertest-session');

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised)

describe("Auth need tests", () => {
  //Rescrictive Access Check
  var testSession = null;

 beforeEach(function () {
   testSession = session(app);
 });

  it('should get login page', (done) => {
  testSession
      .get('/login')
      .expect(200)
      .end(() => done())
  });

 it('should fail accessing a restricted page', function (done) {
     testSession.get('/account')
       .expect(401)
       .end(done)
   });

   it('should access cordon page', function (done) {
      testSession.get('/cordon')
        .expect(200)
        .end(done)
    });

   it('should render sign up page', function (done) {
     testSession.post('/signup')
       .expect(200)
       .end(done);
   });

   it('should not access Account', function (done) {
     testSession.get('/account')
       .expect(401)
       .end(done);
   });

   it('should render 400 status for AfterSignup', function (done) {
     testSession.post('/afterSignup')
     .send({userName: 123})
     .expect(400)
     .end(done);
   })
   it('should render 400 status for AfterSignup', function (done) {
    testSession.post('/afterSignup')
    .send({email: 123})
    .expect(400)
    .end(done);
  })
  it('should render 400 status for AfterSignup', function (done) {
    testSession.post('/afterSignup')
    .send({password: 123})
    .expect(400)
    .end(done);
  })
  it('should render 400 status for AfterSignup', function (done) {
    testSession.post('/afterSignup')
    .send({firstName: 123})
    .expect(400)
    .end(done);
  })
  it('should render 400 status for AfterSignup', function (done) {
    testSession.post('/afterSignup')
    .send({lastName: 123})
    .expect(400)
    .end(done);
  })
  it('should render 400 status for AfterSignup', function (done) {
    testSession.post('/afterSignup')
    .send({phoneNumber: 123})
    .expect(400)
    .end(done);
  })

   it('should not access 5dc1d3ae7125021f285982db', function (done) {
     testSession.get('/singleChild/5dc1d3ae7125021f285982db')
       .expect(401)
       .end(done);
   });

   it('should not access addGeofence', function (done) {
     testSession.get('/addGeofence')
       .expect(401)
       .end(done);
   });

   it('should not access childAdded', function (done) {
     testSession.get('/childAdded')
       .expect(401)
       .end(done);
   });

   it('should not access geofence', function (done) {
     testSession.get('/geofence')
       .expect(401)
       .end(done);
   });

   it('should not access homepage', function (done) {
     testSession.get('/homepage')
       .expect(401)
       .end(done);
   });

   it('should not access viewChildren', function (done) {
     testSession.get('/viewChildren')
       .expect(401)
       .end(done);
   });

   it('should not access logout', function (done) {
      testSession.get('/logout')
        .expect(401)
        .end(done);
    });

    it('should not access addChildToGeofence', (done) => {
      testSession
          .get('/addChildToGeofence/5dbcbab0f8f8319eebe27b68')
          .expect(200)
          .end(done)
  });
})

//try 1
describe("GET /account try 1", function () {
  let testSession = null;

  beforeEach(function () {
      testSession = session(app);
  })

  it('should login', (done) => {
      testSession
          .post('/login')
          .send({ userName: 'kat', password: 'kat' })
          .expect(200)
          .end(() => done());
  });

  it('/login 403 status', (done) => {
    testSession
        .post('/login')
        .send({ userName: 'kat', password: '213' })
        .expect(403)
        .end(() => done());
});

it('/login 403 status', (done) => {
  testSession
      .post('/login')
      .send({ userName: '123', password: 'kat' })
      .expect(403)
      .end(() => done());
});

it('/login 403 status', (done) => {
  testSession
      .post('/login')
      .send({ userName: 'kat', password: '' })
      .expect(403)
      .end(() => done());
});

it('/login 403 status', (done) => {
  testSession
      .post('/login')
      .send({ userName: '', password: 'kat' })
      .expect(403)
      .end(() => done());
});

  it('should get account after login', (done) => {
      testSession
          .get('/account')
          .expect(200)
          .end(() => done())
  });

  it('should get addChildToGeofence after login', (done) => {
      testSession
          .get('/addChildToGeofence/5dbcbab0f8f8319eebe27b68')
          .expect(200)
          .end(() => done())
  });

  it('should get addGeofence after login', (done) => {
      testSession
          .get('/addGeofence')
          .expect(200)
          .end(() => done())
  });

  it('should get geofence after login', (done) => {
      testSession
          .get('/geofence')
          .expect(200)
          .end(() => done())
  });

  it('should get homepage after login', (done) => {
      testSession
          .get('/homepage')
          .expect(200)
          .end(() => done())
  });

  it('should get singleChild after login', (done) => {
      testSession
          .get('/singleChild/5dc1d3ae7125021f285982db')
          .expect(200)
          .end(() => done())
  });

  it('should get singleChild after login', (done) => {
    testSession
        .post('/singleChild/5dc1d3ae7125021f285982db')
        .expect(200)
        .end(() => done())
});

  it('should get viewChildren after login', (done) => {
      testSession
          .get('/viewChildren')
          .send({userID: "5db751c5eaa4f643e85bf023"})
          .expect(200)
          .end(() => done())
  });

  it('should get afterSignup', (done) => {
    testSession
        .post('/afterSignup')
        .expect(200)
        .end(() => done())
  });

});
