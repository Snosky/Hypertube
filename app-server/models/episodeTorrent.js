const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const episodeTorrentSchema = Schema({
    episode_id: { type: Schema.Types.ObjectId, ref: 'Episode' },
    url: { type: String },
    hash: { type: String },
    quality: { type: String },
    seeds: { type: Number },
    peers: { type: Number },
    lastView: { type: Date }
});

module.exports = mongoose.model('EpisodeTorrent', episodeTorrentSchema);
