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
    if (params.genres && params.genres !== 'all')
        config['genres'] = { $in: Array.isArray(params.genres) ? params.genres : [params.genres] };

    if (params.years) {
        let years = params.years.split(',');
        config['year'] = { $gt: parseInt(years[0]) - 1, $lt: parseInt(years[1]) + 1 };
    }
    if (params.rating) {
        let rating = params.rating.split(',');
        config['rating'] = { $gt: parseInt(rating[0]) / 10 - 0.1, $lt: parseInt(rating[1]) / 10 + 0.1 };
    }

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

module.exports.yearsRange = function(req, res){
    Movie.findOne().sort({year: -1}).exec(function(err, max){
        if (err)
            return res.status(500).json(err);

        Movie.findOne().sort({year: 1}).exec(function(err, min){
            if (err)
                return res.status(500).json(err);

            return res.status(200).json({max: max.year, min: min.year});
        });
    })
};
