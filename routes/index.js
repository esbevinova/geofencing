const loginRoutes = require("./login");
const signupRoutes = require("./signup");


const constructorMethod = app => {
    app.use("/signup", signupRoutes);
    app.use("/login", loginRoutes)
    app.use("/", loginRoutes);
    app.use("*", (req, res) => {
      res.status(200).json({message:"no route there"})
        // return res.redirect("/");
    });
  };

module.exports = constructorMethod;