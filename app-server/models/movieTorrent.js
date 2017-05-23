const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieTorrent = Schema({
    id_movie: { type: Schema.Types.ObjectId, ref: 'Movie' },
    url: { type: String },
    hash: { type: String },
    quality: { type: String },
    seeds: { type: Number },
    peers: { type: Number },
    size: { type: String },
    size_bytes: { type: Number },
    lastView: { type: Date }
});

module.exports = mongoose.model('MovieTorrent', movieTorrent);
