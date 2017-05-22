const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const downloaded_torrent = Schema({
    id_movie: { type: Schema.Types.ObjectId, ref: 'Movie' },
    url: { type: String },
    path: { type : String },
    last_seen: {type : Date }
});

module.exports = mongoose.model('Downloaded_torrent', downloaded_torrent);