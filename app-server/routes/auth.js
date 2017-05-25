const User = require('../models/user');
const request = require('request');

const config = require('../config/config');

module.exports.facebook = function(req, res) {
    const accessTokenUrl = 'https://graph.facebook.com/v2.9/oauth/access_token';
    const params = {
        code: req.body.code,
        redirect_uri: req.body.redirect_uri || 'http://localhost:3001/auth/facebook',
        client_id: 1006427196157157,
        client_secret: config.FACEBOOK_SECRET
    };

    // Ask for token
    request.get({url: accessTokenUrl, qs: params, json: true}, function(err, response, token){
        if (response.statusCode !== 200)
            return res.status(400).json({ errors: { message: token.error.message }});

        // Get user profile information
        const fields = ['id', 'email', 'name','picture.type(large)', 'last_name', 'first_name'];
        const graphApiUrl = 'https://graph.facebook.com/v2.9/me?fields=' + fields.join(',');
        request.get({url: graphApiUrl, qs: token, json: true}, function(err, response, profile){
            if (response.statusCode !== 200)
                return res.status(500).json({ errors: { message: profile.error.message }});

            if (!profile.email)
                return res.status(400).json({ errors: { message: 'no email' }});

            User.findOne({ email: profile.email }, function(err, user){
                if (err)
                    return res.status(500).json(err);

                if (user && user.facebookId === profile.id) { // User already connect with Facebook
                    let token = user.generateJwt();
                    res.status(200).send({ token: token });
                }
                else if (user && !user.facebookId) { // User never connect with facebook
                    user.facebookId = profile.id;
                    user.save(function(err){
                        if (err)
                            return res.status(500).json(err);
                        let token = user.generateJwt();
                        return res.status(200).json({ token: token });
                    })
                }
                else {
                    let user = new User();
                    user.facebookId = profile.id;
                    user.username = profile.name.replace(/\W+/g, '');
                    user.email = profile.email;
                    user.pic = profile.picture.data.url;
                    user.lastname = profile.last_name;
                    user.firstname = profile.first_name;
                    user.save(function(err){
                        if (err)
                            return res.status(500).json(err);
                        let token = user.generateJwt();
                        return res.status(200).json({ token: token });
                    })
                }
            });
        });
    });
};

module.exports.fortytwo = function(req, res) {
    const accessTokenUrl = 'https://api.intra.42.fr/oauth/token';
    const params = {
        code: req.body.code,
        grant_type: 'authorization_code',
        client_id: 'b891f269ed7d8f5bca65afaccb26aeffe83e885d8fe173a2c4fd51668daee2fb',
        client_secret: config.FORTYTWO_SECRET,
        redirect_uri: req.body.redirect_uri || 'http://localhost:3001/auth/42'
    };

    request.post({url: accessTokenUrl, form: params, json: true }, function(err, response, body){
        if (err)
            return res.status(500).json(err);

        const graphApiUrl = 'https://api.intra.42.fr/v2/me';
        let headers = { Authorization: 'Bearer ' + body.access_token };
        request.get({url: graphApiUrl, headers: headers, json: true}, function(err, response, profile){
            if (err) return res.status(500).json(err);

            User.findOne({email: profile.email}, function(err, user){
                if (err)
                    return res.status(500).json(err);

                if (user && user.fortytwoId === body.access_token) {
                    let token = user.generateJwt();
                    res.status(200).send({ token: token });
                }
                else if (user) {
                    user.fortytwoId = body.access_token;
                    user.save(function(err){
                        if (err)
                            return res.status(500).json(err);
                        let token = user.generateJwt();
                        return res.status(200).json({ token: token });
                    });
                }
                else {
                    let user = new User();
                    user.fortytwoId = body.access_token;
                    user.username = profile.login.replace(/\W+/g, '');
                    user.email = profile.email;
                    user.pic = profile.image_url;
                    user.lastname = profile.last_name;
                    user.firstname = profile.first_name;
                    user.save(function(err){
                        if (err)
                            return res.status(500).json(err);
                        let token = user.generateJwt();
                        return res.status(200).json({ token: token });
                    });
                }
            });
        })
    });
};
