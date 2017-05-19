const mongoose = require('mongoose');

const episodeSchema = mongoose.Schema({
    show_id: { type: ObjectId },
    title: { type: String },
    synopsis: { type: String },
    season: { type: Number },
    episode: { type: Number },
    firstAired: { type: Number }
});

module.exports = mongoose.model('Episode', episodeSchema);
