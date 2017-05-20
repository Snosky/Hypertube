const Movie = require('../models/movie');
const MovieTorrent = require('../models/movieTorrent');
const url = require('url');

module.exports.getAll = function(req, res){
    params = url.parse(req.url, true).query;

    let limit = parseInt(params.limit) || 20;
    let offset = params.page ? (params.page - 1) * limit : 0;

    let config = {};
    if (params.query_term)
        config['title'] = new RegExp(params.query_term.trim(), 'i');
    // Better search http://stackoverflow.com/questions/28775051/best-way-to-perform-a-full-text-search-in-mongodb-and-mongoose
    if (params.genres)
        config['genres'] = { $in: Array.isArray(params.genres) ? params.genres : [params.genres] };

    Movie.find(config).skip(offset).limit(limit)
        .exec(function(err, movies){
            if (err)
                return res.status(500).json(err);

            return res.status(200).json(movies);
        });
};

module.exports.getOne = function(req, res) {
    let slug = req.params.slug;

    Movie.findOne({ slug: slug}, function(err, movie){
        if (err)
            return res.status(500).json(err);

        return res.status(200).json(movie);
    });
};

module.exports.getTorrents = function(req, res) {
    let slug = req.params.slug;

    Movie.findOne({slug: slug}, function(err, movie){
        if (err)
            return res.status(500).json(err);

        if (!movie)
            return res.status(401).json('movie not found');

        MovieTorrent.find({id_movie: movie._id}, function(err, torrents){
            if (err)
                return res.status(500).json(err);

            return res.status(200).json(torrents);
        })
    });
};
