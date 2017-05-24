const torrentStream = require('torrent-stream');
const fs = require('fs');
const fse = require('fs-extra');
const http = require('http');
const url = require('url');
var srt2vtt = require('srt-to-vtt');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const pump = require('pump');
const request = require('request');
const MovieTorrent = require('../models/movieTorrent');
const Movie = require('../models/movie');
const OS = require('opensubtitles-api');
const OpenSubtitles = new OS('OSTestUserAgentTemp');
// const OpenSubtitles = new OS({
//     useragent:'OSTestUserAgentTemp',
//     username: 'sqku',
//     password: 'hypertube123'
// });
const EpisodeTorrent = require('../models/episodeTorrent');

module.exports.movieStream = function(req, res, next){
    if (!req.params.torrentid)
        return res.status(401).json('No torrent magnet found');

    MovieTorrent.findOneAndUpdate(
        { _id: req.params.torrentid },
        { $set: { lastView: Date.now() } },
        { upsert: false, new: true },
        function(err, torrent){
            if (err) return res.status(500).json('Server error');

            if (!torrent) return res.status(401).json('Torrent not valid');

            req.torrent = torrent;
            req.torrentType = 'movie';
            return next();
        }
    );

};

module.exports.showStream = function(req, res, next){
    if (!req.params.torrentid)
        return res.status(401).json('No torrent magnet found');

    EpisodeTorrent.findOneAndUpdate(
        { _id: req.params.torrentid },
        { $set: { lastView: Date.now() } },
        { upsert: false, new: true },
        function(err, torrent){
            if (err) return res.status(500).json('Server error');

            if (!torrent) return res.status(401).json('Torrent not valid');

            req.torrent = torrent;
            req.torrentType = 'show';
            return next();
        }
    );

};

module.exports.streamFile = function(req, res) {
    const filename = req.torrent._id,
        torrentUrl = req.torrent.url;

    /*if (req.torrent.seeds === 0)
        return res.status(401).json('No seeds');*/

    let filepath = '/tmp/hypertube/' + filename,
        videoFile,
        videoExt,
        test = 0,
        videoLength,
        range,
        positions,
        start,
        end,
        chunksize,
        mimetype,
        contentType;

    console.log(torrentUrl);

    engine = torrentStream(torrentUrl, {
        connections: 3000,
        uploads: 10,
        tmp: filepath,
        path: filepath,
        verify: true,
        dht: true,
        tracker: true,
        trackers: [
            'udp://tracker.openbittorrent.com:80',
            'udp://tracker.ccc.de:80'
        ]
    });

    engine.on('ready', function(){
        if (engine.files.length === 0) {
            console.log("No peers");
            return res.status(401).json("No peers");
        }


        engine.files.forEach(function(file){
            let ext = path.extname(file.name);
            if (['.mp4', '.mkv', '.avi'].indexOf(ext) !== -1) { // If one of this ext
                videoFile = file;
                videoExt = ext;
                return false;
            }
        });

        videoLength = videoFile.length;
        if (req.headers.range) {
            range = req.headers.range;
            let seen = Math.round(videoLength * 0.85);

            positions = range.replace(/bytes=/, '').split('-');
            start = parseInt(positions[0], 10);
            end = positions[1] ? parseInt(positions[1], 10) : videoLength - 1;

            chunksize = end - start + 1;
            mimetype = path.extname(videoFile.name);

            contentType = 'video/' + videoExt === '.webm' ? 'webm' : 'mp4';
            res.writeHead(206, {
                'Content-Range': `bytes ${start} - ${end} / ${videoLength}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': contentType,
            });

            stream = videoFile.createReadStream({start: start, end: end});

            stream.on('error', function(err){
                return res.status(500).json(err);
            });

            if (['.webm', '.mp4'].indexOf(videoExt) === -1) { // If not one of this ext
                try {
                    ffmpeg(stream).videoCodec('libvpx').audioCode('libvorbis').format('mp4')
                        .audioBitrate(128)
                        .videoBitrate(1024)
                        .outputOptions(['-threads 8', '-deadline realtime', '-error-resilient 1']);
                } catch (err) {
                    return res.status(500).json(err);
                }
            }

            pump(stream, res);
        } else {
            res.writeHead(200, {
                'Content-Length': videoLength,
                'Content-Type': 'video/mp4'
            });
            stream = videoFile.createReadStream({test, videoLength});
            pump(stream, res);
        }
    });

    engine.on('download', function() {
        console.log(Math.round((engine.swarm.downloaded / videoFile.length) * 100)+"% downloaded for : ", videoFile.path);
        //Something to do while downlaoding
        // Maybe socket.emit to room watching this movie
    });

    engine.on('idle', function(){
        console.log('Download finish');
        // File finish download
    })

};

module.exports.movieSubtitles = function(req, res, next) {
    let torrent_id = req.params.torrent_id;

    MovieTorrent.find({_id: torrent_id}, function(err, torrent){
        if (err) return res.status(500).json(err);

        if (!movie) return res.status(401).json('no movie');

        req.torrent = torrent;
        next();
    })
};

module.exports.subtitles = function (req, res) {
    let torrent = req.torrent;

    if (!torrent) return res.status(500).json('no torrent');

    Movie.find({ _id: torrent.movie_id }, function(err, movie){
        if(err)
            return res.status(500).json("couldnt find movie");

        if (!movie._id)
            return res.status(401).json('movie not found');

        fse.pathExists('/tmp/hypertube/' + torrent._id + '/subtitles/', function (err, exist) {
            if (err)
                return res.status(500).json("Server error");

            let sub_tab = {};
            if (exist === false)
            {
                OpenSubtitles.search({
                    imdbid: movie.imdb_code,
                    sublanguageid: 'fre, eng'
                }).then(function (subtitles) {
                    console.log(subtitles);

                    if(subtitles['fr'])
                    {
                        let sub_path = '/tmp/hypertube/' + req.body.movie_id + '/subtitles/';

                        fse.mkdirs(sub_path, function(err){
                            if (err)
                                return res.status(401).json("cant create directory for subtitles");
                            else
                            {
                                request(subtitles['fr'].url)
                                    .pipe(srt2vtt())
                                    .pipe(fs.createWriteStream(sub_path + "/" + "fre" + ".vtt"));
                                sub_tab.fre = '/subtitles/' + torrent._id + '/fre';
                                console.log("fre subtitles downloaded")
                            }
                        })
                    }
                    if(subtitles['en'])
                    {
                        let sub_path = '/tmp/hypertube/' + torrent._id + '/subtitles/';

                        fse.mkdirs(sub_path, function(err){
                            if (err)
                                return res.status(401).json("cant create directory for subtitles");
                            else
                            {
                                request(subtitles['en'].url)
                                    .pipe(srt2vtt())
                                    .pipe(fs.createWriteStream(sub_path + "/" + "eng" + ".vtt"));
                                sub_tab.eng = '/subtitles/' + torrent._id + '/eng';
                                console.log("eng subtitles downloaded")
                            }
                        })
                    }
                }).catch(function(err){
                    return res.status(400).json(err);
                });
                return res.status(200).json(sub_tab);
            }
            else
            {
                sub_tab = {
                    fre: '/subtitles/' + torrent._id + '/fre',
                    eng: '/subtitles/' + torrent._id + '/eng'
                };
                return res.status(200).json(sub_tab);
            }
        });
    });
};
