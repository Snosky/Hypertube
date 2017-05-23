const mongoose = require('mongoose');


const movieSchema = mongoose.Schema({
    imdb_code: { type: String },
    title: { type: String },
    slug: { type: String },
    year: { type: Number },
    rating: { type: Number },
    runtime: { type: Number },
    genres: { type: Array },
    description_intro: { type: String },
    description_full: { type: String },
    yt_trailer_code: { type: String },
    language: { type: String },
    mpa_rating: { type: String },
    background_image: { type: String },
    background_image_original: { type: String },
    small_cover_image: { type: String },
    medium_cover_image: { type: String },
    large_cover_image: { type: String },
    seen: { type: Boolean, default: false }
});


module.exports = mongoose.model('Movie', movieSchema);
