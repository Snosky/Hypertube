const torrentStream = require('torrent-stream');
const fs = require('fs');
const http = require('http');
const url = require('url');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const pump = require('pump');
const request = require('request');
const MovieTorrent = require('../models/movieTorrent');

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

module.exports.streamFile = function(req, res) {
    const filename = req.torrent._id,
        torrentUrl = req.torrent.url;

    let filepath = __dirname + '/../videos/' + filename,
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

            let vu = (end - start) * 0.3;
            if (start >= seen || end - vu >= seen)
            {
                console.log("ce film a ete vu");
            }

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

            if (['.webm', '.mp4'].indexOf(videoExt) === -1) { // If not one of this ext
                ffmpeg(stream).videoCodec('libvpx').audioCode('libvorbis').format('mp4')
                    .audioBitrate(128)
                    .videoBitrate(1024)
                    .outputOptions(['-threads 8', '-deadline realtime', '-error-resilient 1']);
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
        console.log('Downloading...');

        console.log(Math.round((engine.swarm.downloaded / videoFile.length) * 100)+"% downloaded for : ", videoFile.path);
        //Something to do while downlaoding
        // Maybe socket.emit to room watching this movie
    });

    engine.on('idle', function(){
        console.log('Download finish');
        // File finish download
    })

};
