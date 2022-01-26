const express = require("express");
const uploadRouter = express.Router();
const Beat = require("../models/beatSchema");
const multer =  require("multer");

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/admin/64127415");
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

uploadRouter.route("/")
    .get(isLoggedIn, (req, res) => {
        res.render("upload");
    })
    .post(fieldUpload, async (req, res) => {
        const newBeat = {
            file: `/beats/${req.files["beatfile"][0].originalname}`,
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
            recordlabel: req.body.recordlabel
        }

        await Beat.create(newBeat)
        .then(beat => {
            res.redirect("/upload");
        })
        .catch(err => console.log(err));
    });

uploadRouter.route("/logout")
    .get((req, res) => {
        req.logOut();
        res.redirect("/admin/64127415");
    })

module.exports = uploadRouter;