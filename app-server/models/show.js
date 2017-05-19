const mongoose = require('mongoose');

const showSchema = mongoose.Schema({
    imdb_id: { type: String },
    title: { type: String },
    year: { type: Number },
    slug: { type: String },
    synopsis: { type: String },
    runtime: { type: Number },
    rating: { type: Number },
    country: { type: String },
    network: { type: String },
    status: { type: Boolean },
    cover_image: { type: String },
    background_image: { type: String }
});

module.exports = mongoose.model('Show', showSchema);
