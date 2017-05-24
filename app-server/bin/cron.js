let CronJob = require('cron').CronJob;
let EpisodeView = require('')

let job = new CronJob('00 01 * * * *', function () {



}, null, true, 'Europe/Paris');