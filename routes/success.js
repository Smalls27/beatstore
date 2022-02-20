const express = require("express");
const successRouter = express.Router();
const Beats = require("../models/beatSchema");

successRouter.route("/:id")
    .get(async (req, res) => {
        const id = req.params.id;
        await Beats.findById({ _id: id })
        .then(beat => {
            const filePath = `${beat.beatfile.destination}`;
            res.download(filePath);
        })
        .catch(err => console.log(err));
    })
    .post(async (req, res) => {
        await Beats.find({})
        .then(beats => {
            res.render("index", { beats: beats });
        })
        .catch(err => console.log(err));
    });

module.exports = successRouter;