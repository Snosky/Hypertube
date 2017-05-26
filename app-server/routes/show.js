const Show = require('../models/show');
const Episode = require('../models/episode');
const EpisodeTorrent = require('../models/episodeTorrent');
const EpisodeSeen = require('../models/episodeSeen');
const Promise = require('bluebird')
const url = require('url');

module.exports.getAll = function(req, res){
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
        config['rating'] = { $gt: parseInt(rating[0]) - 0.1, $lt: parseInt(rating[1]) + 0.1 };
    }

    let sort = '';
    if (params.order && params.order !== 'default')
        sort = params.order;

    Show.find(config).skip(offset).limit(limit).sort(sort)
        .exec(function(err, movies){
            if (err)
                return res.status(500).json(err);

            return res.status(200).json(movies);
        });
};

module.exports.getOne = function(req, res){
    let slug = req.params.slug;

    Show.findOne({ slug: slug }, function(err, show){
        if (err) return res.status(500).json(err);

        if (!show) return res.status(404).json('show not found');

        return res.status(200).json(show);
    })
};

module.exports.yearsRange = function(req, res){
    Show.findOne().where('year').ne(null).sort({year: -1}).exec(function(err, max){
        if (err)
            return res.status(500).json(err);

        if (!max) return res.status(404).json('no shows');

        Show.findOne().where('year').ne(null).sort({year: 1}).exec(function(err, min){
            if (err)
                return res.status(500).json(err);

            if (!min) return res.status(404).json('no shows');

            return res.status(200).json({max: max.year, min: min.year});
        });
    })
};

module.exports.getEpisodes = function(req, res){
    let slug = req.params.slug;

    Show.findOne({ slug: slug }, function(err, show){
        if (err) return res.status(500).json(err);

        if (!show) return res.status(404).json('Show not found');

        Episode.find({ show_id: show._id })
            .sort({season: 1, episode: 1})
            .exec(function(err, episodes){
            if (err) return res.status(500).json(err);

            Promise.each(episodes, function(episode, index){
                return new Promise(function(resolve, reject){

                    EpisodeSeen.findOne({ id_episode: episode._id, user_id: req.payload._id }, function(err, seen){
                        episode.seen = !(err || !seen);

                        EpisodeTorrent.find({ episode_id: episode._id }, function(err, torrents){
                            episode.torrents = torrents;
                            resolve();
                        });

                    });

                })
            })
                .then(function(){
                    return res.status(200).json(episodes)
                });

        })
    })
};

module.exports.seen = function (req, res) {
    EpisodeSeen.findOneAndUpdate(
        {id_episode: req.params.id_episode, user_id: req.payload._id},
        { $set: {
            id_episode: req.params.id_episode,
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
