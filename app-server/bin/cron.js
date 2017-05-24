let CronJob = require('cron').CronJob;
let EpisodeTorrent = require('../models/episodeTorrent');
let MovieTorrent = require('../models/movieTorrent');
let fse = require('fs-extra');
let config = require('../config/config');

let job = new CronJob({
    cronTime: '00 00 6 * * *',
    onTick: function () {

    console.log("cron job start");
    let date = new Date();
    date.setMonth(date.getMonth() - 1);
    // date.setMonth(date.getMinutes() - 1);
    EpisodeTorrent.find({lastView : {$lt: date}}, function (err, result) {
        if (err)
            console.log("erreur cron");
        if(result.length === 0)
            console.log("pas d'episode a delete");
        result.forEach(function (torrent) {

            fse.remove(config.FOLDER_SAVE + torrent._id, function (err) {
                if (err)
                    console.log(err);
                EpisodeTorrent.findOneAndUpdate({ _id: torrent._id}, {lastView: null}, function(err){
                    if(err)
                        console.log(err);
                    console.log("EpisodeTorrent "+ torrent._id +" deleted and lastView updated");
                });
            })
        });
    });

    MovieTorrent.find({lastView : {$lt: date}}, function (err, result) {
        if (err)
            console.log("erreur cron");
        if(result.length === 0)
            console.log("pas de film a delete");
        result.forEach(function (torrent) {

            fse.remove(config.FOLDER_SAVE + torrent._id, function (err) {

                if (err)
                    console.log(err);
                MovieTorrent.findOneAndUpdate({ _id: torrent._id}, {lastView: null}, function(err){
                    if(err)
                        console.log(err);
                    console.log("MovieTorrent "+ torrent._id +" deleted and lastView updated");
                });
            });
        });
    });


},
    start: false,
    timeZone:'Europe/Paris'
});



module.exports = job;
