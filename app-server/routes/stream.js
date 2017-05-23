const torrentStream = require('torrent-stream');
const fs = require('fs');
const http = require('http');
const url = require('url');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const pump = require('pump');
const request = require('request');
const MovieTorrent = require('../models/movieTorrent');
const Downloaded_torrent = require('../models/downloaded_torrent');


module.exports.view_stream = function (req, res) {

    if (req.body.url !== undefined)
    {
        Downloaded_torrent.findOne( {url : req.body.url}, function(err, result){
            if (err)
                throw err;
            if (!result) // dl and stream if no file
            {
                // engine = torrentStream('magnet:?xt=urn:btih:9c7d939a66fc73b6f41be72a4bc4a07469562eff&dn=The+Great+Wall+%282016%29+%5BYTS.AG%5D', {
                // engine = torrentStream('magnet:?xt=urn:btih:A24AE30442C6C98C4F700F9574A2C83D444B88C0&dn=Logan.2017.1080p.KORSUB.HDRip.x264.AAC2.0-STUTTERSHIT&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710%2Fannounce&tr=udp%3A%2F%2F9.rarbg.to%3A2710%2Fannounce&tr=udp%3A%2F%2Ftracker.zer0day.to%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=udp%3A%2F%2Fcoppersurfer.tk%3A6969%2Fannounce', {
                engine = torrentStream(result.url, {
                    connections: 3000,     // Max amount of peers to be connected to.
                    uploads: 10,          // Number of upload slots.
                    tmp: '/videos',          // Root folder for the files storage.
                                          // Defaults to '/tmp' or temp folder specific to your OS.
                                          // Each torrent will be placed into a separate folder under /tmp/torrent-stream/{infoHash}
                    path: '/videos/my-file', // Where to save the files. Overrides `tmp`.
                    verify: true,         // Verify previously stored data before starting
                                          // Defaults to true
                    dht: true,            // Whether or not to use DHT to initialize the swarm.
                                          // Defaults to true
                    tracker: true,        // Whether or not to use trackers from torrent file or magnet link
                                          // Defaults to true
                    trackers: [
                        'udp://tracker.openbittorrent.com:80',
                        'udp://tracker.ccc.de:80'
                    ]
                });


                let videoFile = "";
                let video_ext = "";
                engine.on('ready', function() {

                    engine.files.forEach(function(file) {
                        let ext = path.extname(file.name);
                        console.log("extension : ", ext);
                        console.log("File : ", file);

                        // console.log('filename:', file);
                        if (ext === '.mp4' || ext === '.mkv' || ext === '.avi') {
                            videoFile = file;
                            video_ext = ext;
                            return;
                        }

                    });
                    console.log("videofile : ", videoFile);

                    let test = 0;
                    let videoLength = videoFile.length;
                    if (req.headers.range)
                    {
                        let range = req.headers.range;
                        console.log("headers-range : ", req.headers.range);


                        let positions = range.replace(/bytes=/, '').split('-');
                        let start = parseInt(positions[0], 10);
                        let end = positions[1] ? parseInt(positions[1], 10) : videoLength- 1;
                        let chunksize = (end - start) + 1;
                        let mimetype = path.extname(videoFile.name);

                        console.log("EXT : ", video_ext);
                        if (video_ext === '.mp4' || video_ext === '.webm')
                        {
                            let content_type = "";
                            if (video_ext === '.mp4')
                                content_type = "video/mp4";
                            else if (video_ext === '.webm')
                                content_type = "video/webm";

                            res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + videoLength, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': content_type });
                            stream = videoFile.createReadStream({start : start, end : end});

                            pump(stream, res);
                        }
                        else
                        {
                            res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + videoLength, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
                            stream = videoFile.createReadStream({start : start, end : end});

                            ffmpeg(stream).videoCodec('libvpx').audioCodec('libvorbis').format('mp4')
                                .audioBitrate(128)
                                .videoBitrate(1024)
                                .outputOptions([
                                    '-threads 8',
                                    '-deadline realtime',
                                    '-error-resilient 1'
                                ]);
                            pump(stream, res);
                        }
                    }
                    else {
                        res.writeHead(200, { 'Content-Length': videoLength, 'Content-Type': 'video/mp4' });
                        stream = videoFile.createReadStream({test, videoLength});

                        pump(stream, res);
                    }
                });

                engine.on('download', () => {
                    console.log(Math.round(engine.swarm.downloaded / 1000000)+" Megabytes downloaded for : ", videoFile.path);
                });
                engine.on('idle', () => {
                    console.log('download Complete for : ', videoFile.path);

                    let now = new Date.now();
                    Downloaded_torrent.save({ $set: {
                            id_movie: req.body.id_movie,
                            url: req.body.url,
                            path: "/tmp/my-file/"+videoFile.path,
                            last_seen: now
                        } },
                        { upsert: true },
                        function(err, result) {
                            if (err)
                                throw err;
                        });

                });
            }
            else // just stream if file exists
            {
                let torrent_path = result.path;
                let stat = fs.statSync(torrent_path);
                let test = 0;
                let videoLength = stat.size;
                if (req.headers.range)
                {
                    let range = req.headers.range;
                    console.log("headers-range : ", req.headers.range);


                    let positions = range.replace(/bytes=/, '').split('-');
                    let start = parseInt(positions[0], 10);
                    let end = positions[1] ? parseInt(positions[1], 10) : videoLength- 1;
                    let chunksize = (end - start) + 1;
                    let mimetype = path.extname(videoFile.name);

                    console.log("EXT : ", video_ext);
                    if (video_ext === '.mp4' || video_ext === '.webm')
                    {
                        let content_type = "";
                        if (video_ext === '.mp4')
                            content_type = "video/mp4";
                        else if (video_ext === '.webm')
                            content_type = "video/webm";

                        res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + videoLength, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': content_type });
                        stream = videoFile.createReadStream({start : start, end : end});

                        pump(stream, res);
                    }
                    else
                    {
                        res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + videoLength, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
                        stream = videoFile.createReadStream({start : start, end : end});

                        ffmpeg(stream).videoCodec('libvpx').audioCodec('libvorbis').format('mp4')
                            .audioBitrate(128)
                            .videoBitrate(1024)
                            .outputOptions([
                                '-threads 8',
                                '-deadline realtime',
                                '-error-resilient 1'
                            ]);
                        pump(stream, res);
                    }
                }
                else {
                    res.writeHead(200, { 'Content-Length': videoLength, 'Content-Type': 'video/mp4' });
                    stream = videoFile.createReadStream({test, videoLength});

                    pump(stream, res);

                    let now = new Date.now();
                    Downloaded_torrent.save({ $set: {
                            id_movie: req.body.id_movie,
                            url: req.body.url,
                            path: "/tmp/my-file/"+videoFile.path,
                            last_seen: now
                        } },
                        { upsert: true },
                        function(err, result) {
                            if (err)
                                throw err;
                        });
                }
            }


        });

    }
    else
    {
        // redirect
    }
};

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
            return next();
            //return startStream(torrent._id, torrent.url);
            //return res.status(200).json('Stream starting')
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
        tmp: '/tmp',
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
        //Something to do while downlaoding
        // Maybe socket.emit to room watching this movie
    });

    engine.on('idle', function(){
        console.log('Download finish');
        // File finish download
    })

};
