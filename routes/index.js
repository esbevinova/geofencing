const loginRoutes = require("./login");
const signupRoutes = require("./signup");
const afterSignupRoutes = require("./afterSignup")
const homepageRoutes = require("./homepage")
const geofenceRoutes = require("./geofence")


const constructorMethod = app => {
    app.use("/signup", signupRoutes);
    app.use("/login", loginRoutes)
    app.use("/", loginRoutes);
    app.use("/aftersignup", afterSignupRoutes)
    app.use("/homepage", homepageRoutes)
    app.use("/geofence", geofenceRoutes)
    app.use("*", (req, res) => {
      res.status(200).json({message:"no route there"})
        // return res.redirect("/");
    });
  };

module.exports = constructorMethod;