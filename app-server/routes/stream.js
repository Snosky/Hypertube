let torrentStream = require('torrent-stream');
let fs = require('fs');
let http = require('http');
let url = require('url');
let path = require('path');
let ffmpeg = require('fluent-ffmpeg');
let pump = require('pump');
let request = require('request');


module.exports.view_stream = function (req, res) {
    if (req.body.url !== undefined)
    {

    }
};