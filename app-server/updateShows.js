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
        if (show.num_seasons === 0 || show.episodes === [] || show.year === null)
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

request('https://tv-v2.api-fetch.website/exports/show', function(error, response, body) {

    fs.writeFile('shows.json', body, function(err){
        if (err) throw err;

        const instream = fs.createReadStream('shows.json');
        const outstream = new stream;
        const rl = readline.createInterface(instream, outstream);

        let i = 1;

        rl.on('line', function(line){
            line = JSON.parse(line);
            saveShow(line);
        });

        rl.on('close', function(){
            console.log('finish read');
        })

    });
});
