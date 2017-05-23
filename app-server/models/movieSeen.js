const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSeen = Schema({
    id_movie: { type: Schema.Types.ObjectId, ref: 'Movie' },
    user_id: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('MovieSeen', movieSeen);