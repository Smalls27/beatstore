const express = require("express");
const songManagementRouter = express.Router();
const Beats = require("../models/beatSchema");

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/admin");
}

songManagementRouter.route("/")
    .get(isLoggedIn, async (req, res) => {
        await Beats.find({})
        .then(beats => {
            res.render("songManagement", { beats: beats });
        })
        .catch(err => console.log(err));
    });

songManagementRouter.route("/delete/:id")
    .post(async (req, res) => {
        const id = req.params.id;
        await Beats.findById({ _id: id })
        .then(async beat => {
            const beats = await Beats.find({});
            await Beats.deleteOne({ _id: id });
            res.redirect("/songManagement");
        })
        .catch(err => console.log(err));
    });

songManagementRouter.route("/logout")
    .get((req, res) => {
        req.logOut();
        res.redirect("/admin");
    })

module.exports = songManagementRouter;