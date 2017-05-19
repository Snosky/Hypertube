const mongoose = require('mongoose');

const torrentSchema = mongoose.Schema({
    id_movie: String,
    torrent: Array
});
