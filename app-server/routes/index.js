const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const config = require('../config/config');
const jwtauth = jwt({
    secret: config.TOKEN_SECRET,
    userProperty: 'payload'
});
// TODO : Auth aussi sur register

const upload = require('../middleware/upload');

const user = require('./user');
const auth = require('./auth');
const movie = require('./movie');

// User
router.post('/register', user.picValidation, user.register);
router.post('/auth', user.auth);
router.post('/auth/facebook', auth.facebook);
router.post('/auth/42', auth.fortytwo);
router.post('/user/update', jwtauth, user.update);

// Movies
router.get('/movies', movie.getAll);
router.get('/movie/:slug', movie.getOne);
router.get('/movie/:slug/torrents', movie.getTorrents);



module.exports = router;
