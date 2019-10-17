const express = require("express");
const router = express.Router();

isAuth = (req, res, next) => {
    if (req.session.authority == undefined || req.session.authority == false) {
        res.status(401).render('errorPage', { e: { statusCode: "401", error: "You are not logged in, please login", redirect: "/" } })
    }
    else {
        next();
    }
};

router.use(isAuth);

router.get('/', async (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.render("logout");
        return;
    });
  
});


module.exports = router;