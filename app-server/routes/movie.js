const Movie = require('../models/movie');
const MovieTorrent = require('../models/movieTorrent');
const url = require('url');
const MovieSeen = require('../models/movieSeen');
const Promise = require('bluebird');

module.exports.getAll = function(req, res){
    if (!req.payload._id)
        return res.status(401).json();

    params = url.parse(req.url, true).query;

    let limit = parseInt(params.limit) || 20;
    let offset = params.page ? (params.page - 1) * limit : 0;

    let config = {};
    if (params.query_term)
        config['title'] = new RegExp(params.query_term.trim(), 'i');
    // Better search http://stackoverflow.com/questions/28775051/best-way-to-perform-a-full-text-search-in-mongodb-and-mongoose
    if (params.genres && params.genres !== 'all') {
        let genres = params.genres.split(',');
        config['genres'] = { $in: genres };
    }

    if (params.years) {
        let years = params.years.split(',');
        config['year'] = { $gt: parseInt(years[0]) - 1, $lt: parseInt(years[1]) + 1 };
    }
    if (params.rating) {
        let rating = params.rating.split(',');
        config['rating'] = { $gt: parseInt(rating[0]) / 10 - 0.1, $lt: parseInt(rating[1]) / 10 + 0.1 };
    }

    let sort = '';
    if (params.order && params.order !== 'default')
        sort = params.order;

    Movie.find(config).skip(offset).limit(limit).sort(sort)
        .exec(function(err, movies){
            if (err)
                return res.status(500).json(err);

            Promise.each(movies, function(movie){
                return new Promise(function(resolve, reject){
                    MovieSeen.findOne({ id_movie: movie._id, user_id: req.payload._id }, function(err, seen){
                        movie.seen = !(err || !seen);
                        resolve();
                    });
                });
            }).then(function(){
                return res.status(200).json(movies);
            });
        });
};

module.exports.getOne = function(req, res) {
    let slug = req.params.slug;

    Movie.findOne({ slug: slug}, function(err, movie){
        if (err)
            return res.status(500).json(err);

        if (!movie) return res.status(404).json('no movie found');

        return res.status(200).json(movie);
    });
};

module.exports.getTorrents = function(req, res) {
    let slug = req.params.slug;

    Movie.findOne({slug: slug}, function(err, movie){
        if (err)
            return res.status(500).json(err);

        if (!movie)
            return res.status(404).json('movie not found');

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

        if (!max) return res.status(401).json('no movie')

        Movie.findOne().sort({year: 1}).exec(function(err, min){
            if (err)
                return res.status(500).json(err);

            if (!min) return res.status(401).json('no movie')

            return res.status(200).json({max: max.year, min: min.year});
        });
    })
};

module.exports.seen = function (req, res) {
    MovieSeen.findOneAndUpdate(
        {id_movie: req.params.id_movie, user_id: req.payload._id},
        { $set: {
            id_movie: req.params.id_movie,
            user_id: req.payload._id
        }},
        {upsert: true},
        function(err){
            if (err)
                res.status(500).json(err);
            res.status(200).json();
        }
    )
};
