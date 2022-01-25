const express = require('express');
const indexRouter = express.Router();
const Beats = require("../models/beatSchema");

/* GET home page. */
indexRouter.route('/')
  .get(async (req, res) => {
    await Beats.find({})
    .then(beats => {
      res.render("index", { beats: beats});
    })
  });

module.exports = indexRouter;
