let express = require('express');
let router = express.Router();
let session = require('express-session');
let User = require('../model/user');
let auth = require('../middleware/auth');
let torrentStream = require('torrent-stream');
let fs = require('fs');
let http = require('http');
let url = require('url');
let path = require('path');


router.route('/search')
    .get(auth, (req, res) => {
        engine = torrentStream('magnet:?xt=urn:btih:9c7d939a66fc73b6f41be72a4bc4a07469562eff&dn=The+Great+Wall+%282016%29+%5BYTS.AG%5D', {
            connections: 3000,     // Max amount of peers to be connected to.
            uploads: 10,          // Number of upload slots.
            tmp: '/tmp',          // Root folder for the files storage.
                                  // Defaults to '/tmp' or temp folder specific to your OS.
                                  // Each torrent will be placed into a separate folder under /tmp/torrent-stream/{infoHash}
            path: '/tmp/my-file', // Where to save the files. Overrides `tmp`.
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
        engine.on('ready', function() {

            engine.files.forEach(function(file) {
                let ext = path.extname(file.name);
                console.log("extension : ", ext);
                console.log("File : ", file);


                // console.log('filename:', file);
                if (ext === '.mp4' || ext === '.mkv' || ext === '.avi') {
                    videoFile = file;
                }
            });
            console.log("videofile : ", videoFile);

            let test = 0;
            let videoLength = videoFile.length;
            console.log("headers : ", req.headers);
            if (req.headers.range)
            {
                let range = req.headers.range;
                console.log("headers-range : ", req.headers.range);


                let positions = range.replace(/bytes=/, '').split('-');
                let start = parseInt(positions[0], 10);
                let end = positions[1] ? parseInt(positions[1], 10) : videoLength- 1;
                let chunksize = (end - start) + 1;
                let mimetype = path.extname(videoFile.name);

                // TO DO : conversion en mp4 if (mimetype != mp4)

                res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + videoLength, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' })
                stream = videoFile.createReadStream({start : start, end : end});
                stream.pipe(res);
            }
            else {
                res.writeHead(200, { 'Content-Length': videoLength, 'Content-Type': 'video/mp4' });
                stream = videoFile.createReadStream({test, videoLength});
                stream.pipe(res);
            }
        });

        engine.on('download', () => {
            console.log(Math.round(engine.swarm.downloaded / 1000000)+" Megabytes downloaded for : ", videoFile.path);
        });
        engine.on('idle', () => {
            console.log('download Complete for : ', videoFile.path);
        });


        // var video_path = '/tmp/my-file/The\ Great\ Wall\ \(2016\)\ \[YTS.AG\]//The.Great.Wall.2016.720p.BluRay.x264-[YTS.AG].mp4';
        // var stat = fs.statSync(video_path);
        // var total = stat.size;
        // if (req.headers['range']) {
        //     var range = req.headers.range;
        //     console.log("range : ", range)
        //     var parts = range.replace(/bytes=/, "").split("-");
        //     var partialstart = parts[0];
        //     var partialend = parts[1];
        //
        //     var start = parseInt(partialstart, 10);
        //     var end = partialend ? parseInt(partialend, 10) : total-1;
        //     var chunksize = (end-start)+1;
        //     console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);
        //
        //     var file = fs.createReadStream(video_path, {start: start, end: end});
        //     res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
        //     file.pipe(res);
        // } else {
        //     console.log('ALL: ' + total);
        //     res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4' });
        //     fs.createReadStream(video_path).pipe(res);
        // }



        // res.render('search');
    })

    .post(auth, (req, res) => {
        res.redirect('search');
    });

module.exports = router;
