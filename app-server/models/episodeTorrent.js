const mongoose = require('mongoose');

const episodeTorrentSchema = mongoose.Schema({
    episode_id: { type: ObjectId },
    peers: { type: Number },
    seeds: { type: Number },
    url: { type: String },
    quality: { type: String }
});

module.exports = mongoose.model('EpisodeTorrent', episodeTorrentSchema);
