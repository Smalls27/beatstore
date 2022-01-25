const express = require("express");
const accountRouter = express.Router();
const Admin = require("../models/AdminSchema");
const bcrypt = require("bcrypt");

accountRouter.route("/")
    .get((req, res) => {
        let errMessage;
        res.render("account", { errMessage: errMessage });
    })
    .post(async (req, res) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newAdmin = {
            username: req.body.username,
            password: hashedPassword
        }

        await Admin.findOne({ username: newAdmin.username })
        .then(async admin => {
            if (!admin) {
                await Admin.create(newAdmin)
                .then(admin => {
                    res.redirect('/admin');
                })
                .catch(err => console.log(err));
            } else {
                errMessage = "Username already exists...";
                res.render('account', { errMessage: errMessage });
            }
        })
    })

module.exports = accountRouter;