const loginRoutes = require("./login");
const signupRoutes = require("./signup");
const afterSignupRoutes = require("./afterSignup")
const homepageRoutes = require("./homepage")
const geofenceRoutes = require("./geofence")
const account = require("./account")
const childAddedRoute = require("./childAdded")
const logoutRoute = require("./logout")
const addGeofenceRoute = require("./addGeofence")
const viewChildrenRoute = require("./viewChildren")
const addchildToGeofenceRoute = require("./addChildToGeofence")
const cordonRoute = require("./cordon")
const singleChildRoutes = require("./singleChild")


const constructorMethod = app => {
    app.use("/signup", signupRoutes);
    app.use("/login", loginRoutes)
    //app.use("/", loginRoutes);
    app.use("/", cordonRoute)
    app.use("/cordon", cordonRoute)
    app.use("/aftersignup", afterSignupRoutes)
    app.use("/homepage", homepageRoutes)
    app.use("/geofence", geofenceRoutes)
    app.use("/account", account)
    app.use("/childAdded", childAddedRoute)
    app.use("/logout", logoutRoute)
    app.use("/addGeofence", addGeofenceRoute)
    app.use("/viewChildren", viewChildrenRoute)
    app.use("/addChildToGeofence", addchildToGeofenceRoute)
    app.use("/singleChild", singleChildRoutes)
    app.use("*", (req, res) => {
      res.status(200).json({message:"no route there"})
        // return res.redirect("/");
    });
  };

module.exports = constructorMethod;