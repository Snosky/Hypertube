const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const config = require('../config/config');
const jwtauth = jwt({
    secret: config.TOKEN_SECRET,
    userProperty: 'payload'
});
// TODO : Auth aussi sur register

const user = require('./user');
const auth = require('./auth');
const movie = require('./movie');
const show = require('./show');
const stream = require('./stream');
const comment = require('./comment');

// User
router.post('/register', user.picValidation, user.register);
router.post('/auth', user.auth);
router.post('/auth/facebook', auth.facebook);
router.post('/auth/42', auth.fortytwo);
router.post('/user/update', [jwtauth, user.picValidation], user.update);
router.get('/user/me', jwtauth, user.me);
router.get('/user/profile/:uid', jwtauth, user.uid);
router.get('/user/lang/:lang', jwtauth, user.updateLang);
router.post('/user/forgotPassword', user.forgotPassword);
router.get('/user/verifyToken/:token', user.verifyToken);
router.post('/user/updatePassword', user.updatePassword);

// Movies
router.get('/movies/years', jwtauth, movie.yearsRange);
router.get('/movies', jwtauth, movie.getAll);
router.get('/movie/watch/:torrentid', stream.movieStream, stream.streamFile);
router.get('/movie/subtitles/:torrent_id', [stream.movieSubtitles], stream.subtitles);
router.get('/movie/:slug', jwtauth, movie.getOne);
router.get('/movie/:slug/torrents', jwtauth, movie.getTorrents);
router.get('/movie/:id_movie/seen', jwtauth, movie.seen);


// Shows
router.get('/shows/years', jwtauth, show.yearsRange);
router.get('/shows', jwtauth, show.getAll);
router.get('/show/subtitles/:torrent_id', [stream.showSubtitles], stream.subtitles);
router.get('/show/watch/:torrentid', stream.showStream, stream.streamFile);
router.get('/show/:slug', jwtauth, show.getOne);
router.get('/show/:slug/episodes', jwtauth, show.getEpisodes);
router.get('/show/:id_episode/seen', jwtauth, show.seen);

router.get('/subtitle/:folder/:file', stream.getSubtitleFile);

// Comments
router.post('/comment/add', jwtauth, comment.addComment);
router.get('/comment/get/:imdb_code', jwtauth, comment.getComment);


module.exports = router;
