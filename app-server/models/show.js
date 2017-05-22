const mongoose = require('mongoose');

const showSchema = mongoose.Schema({
    imdb_code: { type: String },
    title: { type: String },
    slug: { type: String },
    year: { type: Number },
    rating: { type: Number },
    runtime: { type: Number },
    genres: { type: Array },
    description_full: { type: String },
    country: { type: String },
    network: { type: String },
    air_day: { type: String },
    air_time: { type: String },
    status: { type: String },
    cover_image: { type: String },
    background_image: { type: String }
});

module.exports = mongoose.model('Show', showSchema);
