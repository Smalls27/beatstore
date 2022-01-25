const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const beatSchema = new Schema({
    file: {
        type: String
    },
    
    producer: {
        type: String
    },

    beat: {
        type: String
    },

    album: {
        type: String
    },

    bpm: {
        type: Number
    },

    imagefile: {
        fieldname: String,
		originalname: String,
		encoding: String,
		mimetype: String,
		destination: String,
		filename: String,
		path: String,
		size: Number
    },

    beatfile: {
        fieldname: String,
		originalname: String,
		encoding: String,
		mimetype: String,
		destination: String,
		filename: String,
		path: String,
		size: Number
    },

    recordlabel: {
        type: String
    }
});

const Beat = mongoose.model("Beat", beatSchema);

module.exports = Beat;