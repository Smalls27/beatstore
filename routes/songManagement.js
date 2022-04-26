const express = require("express");
const songManagementRouter = express.Router();
const Beats = require("../models/beatSchema");
const multer = require("multer");

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/admin");
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/beats/");
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({storage: storage});
const fieldUpload = upload.fields([{ name: "beatfile", maxCount: 1}, { name: "imagefile", maxCount: 1}]);

songManagementRouter.route("/")
    .get(isLoggedIn, async (req, res) => {
        await Beats.find({})
        .then(beats => {
            res.render("songManagement", { 
                beats: beats,
                file: beats.file,
                producer: beats.producer,
                beat: beats.beat,
                album: beats.album,
                bpm: beats.bpm,
                imagefile: beats.imagefile,
                beatfile: beats.beatfile,
                recordlabel: beats.recordlabel,
                id: beats._id
            });
        })
        .catch(err => console.log(err));
    })

songManagementRouter.route("/:id")
    .post(fieldUpload, async (req, res) => {
        const id = req.params.id;
        await Beats.findOneAndUpdate({ _id: id}, {
            producer: req.body.producer,
            beat: req.body.beat,
            album: req.body.album,
            bpm: req.body.bpm,
            imagefile: {
                fieldname: req.files["imagefile"][0].fieldname,
                originalname: req.files["imagefile"][0].originalname,
                encoding: req.files["imagefile"][0].encoding,
                mimetype: req.files["imagefile"][0].mimetype,
                destination: req.files["imagefile"][0].destination + req.files["imagefile"][0].originalname,
                filename: req.files["imagefile"][0].filename,
                path: req.files["imagefile"][0].path,
                size: req.files["imagefile"][0].size
            },
            beatfile: {
                fieldname: req.files["beatfile"][0].fieldname,
                originalname: req.files["beatfile"][0].originalname,
                encoding: req.files["beatfile"][0].encoding,
                mimetype: req.files["beatfile"][0].mimetype,
                destination: req.files["beatfile"][0].destination + req.files["beatfile"][0].originalname,
                filename: req.files["beatfile"][0].filename,
                path: req.files["beatfile"][0].path,
                size: req.files["beatfile"][0].size
            },
            recordlabel: req.body.recordlabel,
        }, null)
        .then(beat => {
            res.redirect("/songManagement");
        })
    })

songManagementRouter.route("/update/:id")
    .post(async (req, res) => {
        const id = req.params.id;
        const beats = await Beats.find({});
        Beats.findById({ _id: id})
        .then(beat => {
            res.render("songManagement", { 
                beats: beats,
                file: beat.file,
                producer: beat.producer,
                beat: beat.beat,
                album: beat.album,
                bpm: beat.bpm,
                imagefile: beat.imagefile,
                beatfile: beat.beatfile,
                recordlabel: beat.recordlabel,
                id: beat._id
            })
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