const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const episodeTorrentSchema = Schema({
    episode_id: { type: Schema.Types.ObjectId, ref: 'Episode' },
    peers: { type: Number },
    seeds: { type: Number },
    url: { type: String },
    quality: { type: String }
});

module.exports = mongoose.model('EpisodeTorrent', episodeTorrentSchema);
