const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'User' },
    imdb_code: { type: String },
    comment: {type: String},
    created_at: {type : Date}
});


module.exports = mongoose.model('Comment', commentSchema);
