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

// User
router.post('/register', user.picValidation, user.register);
router.post('/auth', user.auth);
router.post('/auth/facebook', auth.facebook);
router.post('/auth/42', auth.fortytwo);
router.post('/user/update', [jwtauth, user.picValidation], user.update);
router.get('/user/me', jwtauth, user.me);

// Movies
router.get('/movies/years', jwtauth, movie.yearsRange);
router.get('/movies', jwtauth, movie.getAll);
router.get('/movie/:slug', jwtauth, movie.getOne);
router.get('/movie/:slug/torrents', jwtauth, movie.getTorrents);

// Shows
router.get('/shows', jwtauth, show.getAll);
router.get('/shows/years', jwtauth, show.yearsRange);
router.get('/show/:slug', jwtauth, show.getOne);

module.exports = router;
