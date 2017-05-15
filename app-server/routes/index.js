const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const config = require('../config/config');
const jwtauth = jwt({
    secret: config.TOKEN_SECRET,
    userProperty: 'payload'
});
// TODO : Auth aussi sur register
// Sur angular si pas co on demande juste un token au serveur que l'on utilise pour accede a register
const user = require('./user');

router.post('/register', user.register);
router.post('/auth', user.auth);

const auth = require('./auth');
router.post('/auth/facebook', auth.facebook);
router.post('/auth/42', auth.fortytwo);

router.post('/user/update', jwtauth, user.update);

module.exports = router;
