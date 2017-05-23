const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const episodeSchema = Schema({
    tvdb_id: { type: String },
    show_id: { type: Schema.Types.ObjectId, ref: 'Show' },
    title: { type: String },
    description_full: { type: String },
    season: { type: Number },
    episode: { type: Number },
    first_aired: { type: Number },
    torrents: { type: Array, default: []},
    seen: { type: Boolean, default: false }
});

module.exports = mongoose.model('Episode', episodeSchema);
