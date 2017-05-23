const mongoose = require('mongoose');
const request = require('request');
const Promise = require('bluebird');
const fs = require('fs');
const readline = require('readline');
const stream = require('stream');

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
        if (!show.imdb_id || show.num_seasons === 0 || show.episodes === [] || show.year === null)
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
                if (err) {
                    return reject(show.imdb_id, error);
                }

                // Save show episodes
                saveEpisodes(result._id, show.episodes)
                    .then(function(){
                        return resolve(show.imdb_id);
                    })
                    .catch(function(error){
                        return reject(show.imdb_id, error);
                    });
            });
    });
};

const saveEpisodes = function(show_id, episodes) {
    return Promise.each(episodes, function(episode){
        return new Promise(function(resolve, reject){
            ShowEpisode.findOneAndUpdate(
                { tvdb_id: episode.tvdb_id },
                { $set: {
                    tvdb_id: episode.tvdb_id,
                    show_id: show_id,
                    title: episode.title,
                    description_full: episode.overview,
                    season: episode.season,
                    episode: episode.episode,
                    first_aired: episode.first_aired,
                }},
                { upsert: true, new: true },
                function (err, result){
                    if (err) {
                        return reject(err);
                    }

                    // Save torrent
                    saveTorrents(result._id, episode.torrents)
                        .then(function(){
                            return resolve();
                        })
                        .catch(function(error){
                            return reject(error);
                        })
                }
            )
        });
    })
};

const saveTorrents = function(episode_id, torrents){
    const qualities = ['480p', '720p', '1080p'];

    let hash,
        torrent;
    return Promise.each(qualities, function(quality){
        const regex = /magnet:\?xt=urn:btih:([A-Za-z0-9]*)/g;
        return new Promise(function(resolve, reject){
            torrent = torrents[quality];
            if (torrent === undefined) {
                return resolve();
            } else {
                hash = regex.exec(torrent.url);
                EpisodeTorrent.findOneAndUpdate(
                    { hash: hash[1] },
                    { $set: {
                        episode_id: episode_id,
                        url: torrent.url,
                        hash: hash[1],
                        quality: quality,
                        seeds: torrent.seeds,
                        peers: torrent.peers
                    }},
                    { upsert: true, new: true },
                    function (err, result){
                        if (err) {
                            return reject(err);
                        }
                        return resolve();
                    }
                )
            }
        });
    })
};

request('https://tv-v2.api-fetch.website/exports/show', function(error, response, body) {

    fs.writeFile('shows.json', body, function(err){
        if (err) throw err;

        const instream = fs.createReadStream('shows.json');
        const outstream = new stream;
        const rl = readline.createInterface(instream, outstream);

        let i = 1;

        rl.on('line', function(line){
            line = JSON.parse(line);
            saveShow(line)
                .then(function(title){
                    if (title)
                        console.log('Show updated', title);
                })
                .catch(function(imdb, error){
                    console.error('Error ' + imdb, error);
                });
        });

        rl.on('close', function(){
            console.log('finish read');
        })

    });
});
