const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const jwtauth = jwt({
    secret: 'MY_SECRET', // TODO : Change, for more security put it in ENV
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

module.exports = router;
