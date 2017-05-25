const torrentStream = require('torrent-stream');
const fs = require('fs');
const fse = require('fs-extra');
const http = require('http');
const url = require('url');
const srt2vtt = require('srt-to-vtt');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const pump = require('pump');
const request = require('request');
const MovieTorrent = require('../models/movieTorrent');
const Movie = require('../models/movie');
const EpisodeTorrent = require('../models/episodeTorrent');
const Episode = require('../models/episode');
const Show = require('../models/show');
const OS = require('opensubtitles-api');
const OpenSubtitles = new OS('OSTestUserAgentTemp');
const config = require('../config/config');
const Transcoder = require('stream-transcoder');
const Promise = require('bluebird');

module.exports.movieStream = function(req, res, next){
    if (!req.params.torrentid)
        return res.status(400).json('No torrent magnet found');

    MovieTorrent.findOneAndUpdate(
        { _id: req.params.torrentid },
        { $set: { lastView: Date.now() } },
        { upsert: false, new: true },
        function(err, torrent){
            if (err) return res.status(500).json('Server error');

            if (!torrent) return res.status(400).json('Torrent not valid');

            req.torrent = torrent;
            req.torrentType = 'movie';
            return next();
        }
    );

};

module.exports.showStream = function(req, res, next){
    if (!req.params.torrentid)
        return res.status(400).json('No torrent magnet found');

    EpisodeTorrent.findOneAndUpdate(
        { _id: req.params.torrentid },
        { $set: { lastView: Date.now() } },
        { upsert: false, new: true },
        function(err, torrent){
            if (err) return res.status(500).json('Server error');

            if (!torrent) return res.status(400).json('Torrent not valid');

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

    let filepath = config.FOLDER_SAVE + filename,
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
            return res.status(400).json("No peers");
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

                    new Transcoder(stream)
                        .videoCodec('h264')
                        .audioCodec('aac')
                        .format('mp4')
                        .on('finish', function() {
                            console.log('stream converted');
                        })
                        .stream().pipe(res);

                    // ffmpeg(stream).videoCodec('libvpx').audioCode('libvorbis').format('mp4')
                    //     .audioBitrate(128)
                    //     .videoBitrate(1024)
                    //     .outputOptions(['-threads 8', '-deadline realtime', '-error-resilient 1']);
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

    MovieTorrent.findOne({_id: torrent_id})
        .populate('id_movie', {imdb_code: 1})
        .exec(function(err, torrent){
        if (err) return res.status(500).json(err);

        if (!torrent) return res.status(400).json('no torrent');

        req.torrent = {
            torrent_id: torrent._id,
            imdb_code: torrent.id_movie.imdb_code
        };
        next();
    })
};

module.exports.showSubtitles = function(req, res, next) {
    let torrent_id = req.params.torrent_id;

    EpisodeTorrent.findOne({_id: torrent_id})
        .populate({
            path: 'episode_id',
            select: '_id show_id',
            populate: { path: 'show_id', select: 'imdb_code' }
        })
        .exec(function(err, torrent){
            if (err) return res.status(500).json(err);

            if (!torrent) return res.status(400).json('no torrent');

            req.torrent = {
                torrent_id: torrent._id,
                imdb_code: torrent.episode_id.show_id.imdb_code
            };
            next();
        });
};

module.exports.subtitles = function(req, res) {
    let torrent = req.torrent;

    if (!torrent) return res.status(500).json({'message': 'torrent error'});

    let subpath = config.FOLDER_SAVE + torrent.torrent_id + '/subtitles';
    let subtitlesUrl = {};
    fse.pathExists(subpath, function(err, exist){
        if (err) return res.status(500).json(err);

        if (exist) {
            if (fs.existsSync(subpath + '/fre.vtt'))
                subtitlesUrl.fre = '/subtitle/' + torrent.torrent_id + '/fre.vtt';
            if (fs.existsSync(subpath + '/eng.vtt'))
                subtitlesUrl.eng = '/subtitle/' + torrent.torrent_id + '/eng.vtt';
            return res.status(200).json(subtitlesUrl);
        }
        OpenSubtitles.search({imdbid: torrent.imdb_code, sublanguageid: 'fre, eng'})
            .then(function(subtitles){
                if (!subtitles['fr'] && !subtitles['en'])
                    return res.status(400).json({'message': 'No subtitles available.'});

                fse.mkdirs(subpath, function(err){
                    if (err) return res.status(500).json(err);

                    const langs = ['fr', 'en'];
                    const langstag = { 'fr': 'fre', 'en': 'eng'};

                    Promise.each(langs, function(lang){
                        return new Promise(function(resolve, reject){
                            if (!subtitles[lang])
                                return resolve(false);

                            let stream = request(subtitles[lang].url)
                                .pipe(srt2vtt())
                                .pipe(fs.createWriteStream(subpath + '/' + langstag[lang] + '.vtt'));

                            stream.on('finish', function(){
                                resolve(true);
                            })

                        }).then(function(ok){
                            if (ok)
                                subtitlesUrl[langstag[lang]] = '/subtitle/' + torrent.torrent_id + '/' + langstag[lang] + '.vtt';
                        })
                    })
                        .then(function(){
                            return res.status(200).json(subtitlesUrl);
                        });
                });
            })
            .catch(function(err){
                return res.status(500).json(err);
            })
        });
};

module.exports.getSubtitleFile = function(req, res) {
    let fileName = config.FOLDER_SAVE + '/' + req.params.folder + '/subtitles/' + req.params.file;
    res.sendFile(fileName, function (err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
        else {
            console.log('Sent:', fileName);
        }
    });
};