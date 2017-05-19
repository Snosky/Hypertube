const mongoose = require('mongoose');


const movieSchema = mongoose.Schema({
    id : ObjectId,
    imdb_code: String,
    title: String,
    slug: String,
    year: Number,
    rating: Number,
    genres: Array,
    description_intro: String,
    description_full: String,
    yt_trailer_code: String,
    language: String,
    mpa_rating: String,
    background_image: String,
    background_image_original: String,
    small_cover_image: String,
    medium_cover_image: String,
    large_cover_image: String
});


module.exports = mongoose.model('movie', movieSchema);