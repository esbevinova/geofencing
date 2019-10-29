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


const constructorMethod = app => {
    app.use("/signup", signupRoutes);
    app.use("/login", loginRoutes)
    app.use("/", loginRoutes);
    app.use("/aftersignup", afterSignupRoutes)
    app.use("/homepage", homepageRoutes)
    app.use("/geofence", geofenceRoutes)
    app.use("/account", account)
    app.use("/childadded", childAddedRoute)
    app.use("/logout", logoutRoute)
    app.use("/addGeofence", addGeofenceRoute)
    app.use("/viewChildren", viewChildrenRoute)
    app.use("*", (req, res) => {
      res.status(200).json({message:"no route there"})
        // return res.redirect("/");
    });
  };

module.exports = constructorMethod;