const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const episodeSeen = Schema({
    id_episode: { type: Schema.Types.ObjectId, ref: 'Episode' },
    user_id: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('EpisodeSeen', episodeSeen);
