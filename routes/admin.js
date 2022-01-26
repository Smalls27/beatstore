const express = require("express");
const adminRouter = express.Router();
const passport = require("passport");

const isLoggedOut = (req, res, next) => {
    if (!req.isAuthenticated()) return next();
    res.redirect("/upload");
}

adminRouter.route("/")
    .get(isLoggedOut, (req, res) => {
        res.render("adminlogin");
    })
    .post(passport.authenticate("local", { successRedirect: "/upload", failureRedirect: "/admin64127415" }) ,(req, res) => {
        
    })

module.exports = adminRouter;