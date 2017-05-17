const User = require('../models/user');

/**
 * Registration route
 * @param req
 * @param res
 */
module.exports.register = function(req, res) {
    // Data validation
    req.checkBody('username', 'Invalid username').notEmpty().isAlphanumeric();
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();

    req.checkBody('firstname', 'Invalid firstname').notEmpty().isAlpha();
    req.checkBody('lastname', 'Invalid firstname').notEmpty().isAlpha();

    req.checkBody('password', 'Invalid password').notEmpty().matches(/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/);
    req.checkBody('password', 'Password do not match').equals(req.body.passwordConf);

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.useFirstErrorOnly().mapped() });
        }

        let user = new User();
        user.username = req.body.username;
        user.email = req.body.email;
        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;
        user.password = req.body.password;
        user.hashPassword()
            .then(function() {
                user.save(function(err) {
                    if (err) return res.status(400).json(err);

                    const token = user.generateJwt();
                    res.status(200).json({ token: token });
                });
            })
            .catch(function(err) {
                console.log('bcrypt', err);
                return res.status(400).json(err);
            });
    });
};

/**
 * Authenticate user
 * @param req
 * @param res
 */
module.exports.auth = function(req, res) {
    req.checkBody('username').notEmpty();
    req.checkBody('password').notEmpty();

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.useFirstErrorOnly().mapped() });
        }

        let username = new RegExp('^' + req.body.username, 'i');
        User.findOne({username: username}, function(err, user){
            if (err) return res.status(400).json(err);

            if (!user || !user.password) return res.status(401).json({ errors: { kind: 'invalid_password' }});

            user.checkPassword(req.body.password)
                .then((result) => {
                    if (!result) return res.status(401).json({ errors: { kind: 'invalid_password' }});

                    let token = user.generateJwt();
                    return res.status(200).json({ token: token });
                })
        });
    });
};

module.exports.profile = function(req, res) {
    if (!req.payload._id)
        return res.status(401).json({ "message" : "UnauthorizedError: private profile" });

    User.findById(req.payload._id)
        .exec(function(err, user){
            if (err)
                return res.status(500).json(err);
            return res.status(200).json(user);
        });
};

module.exports.update = function(req, res) {
    if (!req.payload._id)
        return res.status(401).json({ "message" : "UnauthorizedError: private profile" });

    req.checkBody('username', 'Invalid username').notEmpty().isAlphanumeric();
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('firstname', 'Invalid firstname').notEmpty().isAlpha();
    req.checkBody('lastname', 'Invalid firstname').notEmpty().isAlpha();

    if (req.body.password) {
        req.checkBody('password', 'Invalid password').notEmpty().matches(/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/);
        req.checkBody('password', 'Password do not match').equals(req.body.passwordConf);
    }

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            return res.status(400).json({errors: result.useFirstErrorOnly().mapped()});
        }

        User.findById(req.payload._id, function(err, user){
            if (err)
                return res.status(500).json(err);

            user.username = req.body.username;
            user.email = req.body.email;
            user.firstname = req.body.firstname;
            user.lastname = req.body.lastname;

            if (req.body.password) {
                user.password = req.body.password;
                user.hashPassword()
                    .then(() => {
                        user.save(function(err){
                            if (err)
                                return res.status(500).json(err);
                            let token = user.generateJwt();
                            return res.status(200).json({ token: token });
                        })
                    });
            } else {
                user.save(function(err){
                    if (err)
                        return res.status(500).json(err);
                    let token = user.generateJwt();
                    return res.status(200).json({ token: token });
                })
            }
        });
    });
};
