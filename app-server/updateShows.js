const mongoose = require('mongoose');
const request = require('request');
const Promise = require('bluebird');
const fs = require('fs');
const lineReader = require('readline');

const config = require('./config/config');

// Configuration db
mongoose.Promise = Promise;
mongoose.connect(config.MONGO_URI);

// Models
const Show = require('./models/show');
const ShowEpisode = require('./models/episode');
const EpisodeTorrent = require('./models/episodeTorrent');

const saveShow = function(show) {
    return new Promise(function(resolve, reject){
        if (show.num_seasons === 0 || show.episodes === [])
            return resolve();

        Show.findOneAndUpdate(
            { imdb_code: show.imdb_id },
            { $set: {
                imdb_code: show.imdb_id,
                title: show.title,
                slug: show.slug,
                year: show.year,
                rating: show.rating.percentage,
                runtime: show.runtime,
                genres: show.genres,
                description_full: show.synopsis,
                country: show.country,
                network: show.network,
                air_day: show.air_day,
                air_time: show.air_time,
                status: show.status,
                cover_image: show.images.poster,
                background_image: show.images.banner
            }},
            { upsert: true, new: true },
            function (err, result) {
                if (err)
                    return reject(err);
                return resolve();
            });
    });
};

request('https://tv-v2.api-fetch.website/shows', function(error, response, body) {
    let pages = JSON.parse(body);

    Promise.each(pages, function(page){
        return new Promise(function(resolve, reject){
            request('https://tv-v2.api-fetch.website/' + page + '?sort=last%20added&order=1', function(err, response, body){
                let shows = JSON.parse(body);

                Promise.each(shows, saveShow)
                    .then(function(){
                        return resolve();
                    })
                    .catch(function(err){
                        return reject(err)
                    });
                //return resolve();
            })
        });
    })
        .then(function(){
            console.log('Show updated')
        })
        .catch(function(err){
            console.error(err);
        })



    /*fs.writeFile('', shows, function(err){
        if (err)
            return console.error(err);

        // Read interface



    });
    /*
    async.each(shows, function(show, callback){
        Show.findOneAndUpdate(
            { imdb_code: show.imdb_id },
            { $set: {
                imdb_code: show.imdb_id,
                title: show.title,
                slug: show.slug,
                year: show.year,
                rating: show.rating.percentage,
                runtime: show.runtime,
                genres: show.genres,
                description_full: show.synopsis,
                country: show.country,
                network: show.network,
                air_day: show.air_day,
                air_time: show.air_time,
                status: show.status,
                cover_image: show.images.poster,
                background_image: show.images.banner
            }},
            { upsert: true, new: true },
            function (err, result) {
                if (err)
                    return callback(err);
                return callback();
            });
    }, function(err) {
        if( err ) {
            console.log('A file failed to process');
        } else {
            console.log('All files have been processed successfully');
        }
    });
    return;
    /*Promise.each(shows, function(show){
        // Don't save if no episodes
        if (show.num_seasons === 0 || show.episodes === [])
            return resolve();

        return new Promise(function(resolve, reject){
            Show.findOneAndUpdate(
                { imdb_code: show.imdb_id },
                { $set: {
                    imdb_code: show.imdb_id,
                    title: show.title,
                    slug: show.slug,
                    year: show.year,
                    rating: show.rating.percentage,
                    runtime: show.runtime,
                    genres: show.genres,
                    description_full: show.synopsis,
                    country: show.country,
                    network: show.network,
                    air_day: show.air_day,
                    air_time: show.air_time,
                    status: show.status,
                    cover_image: show.images.poster,
                    background_image: show.images.banner
                }},
                { upsert: true, new: true },
                function (err, result) {
                    if (err)
                        return reject(err);
                    return resolve();
                    /*
                    let ShowId = result._id;

                    Promise.each(show.episodes, function(episode){
                        return new Promise(function(resolve, reject){
                            if (episode.torrents === [])
                                return resolve();

                            Episode.findOneAndUpdate(
                                { tvdb_id: episode.tvdb_id },
                                { $set: {
                                    tvdb_id: episode.tvdb_id,
                                    show_id: ShowId,
                                    title: episode.title,
                                    description_full: episode.overview,
                                    season: episode.season,
                                    episode: episode.episode,
                                    first_aired: episode.first_aired
                                }},
                                { upsert: true, new: true },
                                function(err, episodeResult) {
                                    if (err)
                                        return reject(err);
                                    let episodeId = episodeResult._id;

                                    Promise.each(episode.torrents, function(torrent){
                                        return new Promise(function(resolve, reject){
                                            EpisodeTorrent.findOneAndUpdate(
                                                { h}
                                            )
                                        });
                                    })
                                        .then(function(){
                                            return resolve();
                                        })
                                        .catch(function(){
                                            return reject();
                                        })
                                }
                            )
                        });
                    })
                        .then(() => {
                            return resolve();
                        })
                        .catch(function(err){
                            return reject(err);
                        })
                    /* // END FIRST COMMENT
                }
            )
        });
    })
        .then(function(){
            console.log('Shows updated');
        })
        .catch(function(err){
            console.error(err);
        })*/
});
