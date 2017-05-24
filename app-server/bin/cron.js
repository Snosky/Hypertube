let CronJob = require('cron').CronJob;
let EpisodeTorrent = require('/app-server/models/episodeTorrent');
let epi
let MovieTorrent = require('/app-server/models/movieTorrent');
let fse = require('fs-extra');
let config = require('../config/config');

let job = new CronJob('00 01 * * * *', function () {

    let date = new Date();
    date.setMonth(date.getMonth() - 1);
    EpisodeTorrent.find({lastView : {$lt: date}}, function (err, result) {
        if (err)
            console.log("erreur cron");
        if(!result)
            console.log("pas de film a delete");
        result.forEach(function (torrent) {

            fse.remove(config.FOLDER_SAVE + torrent._id, function (err) {
                if (err)
                    console.log(err);
                console.log(torrent._id, " deleted");
            })
        });
    })



}, null, true, 'Europe/Paris');