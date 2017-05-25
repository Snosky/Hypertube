const User = require('../models/user');
const fs = require('fs');
let nodemailer = require('nodemailer');
let sha256 = require("crypto-js/sha256");

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
            fs.unlink(req.file.path, function(err) {
                console.error('FS', err);
            });
            return res.status(400).json({ errors: result.useFirstErrorOnly().mapped() });
        }

        let user = new User();
        user.username = req.body.username;
        user.email = req.body.email;
        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;
        user.password = req.body.password;
        user.pic = req.file.filename;
        user.hashPassword()
            .then(function() {
                user.save(function(err) {
                    if (err) {
                        fs.unlink(req.file.path, function(err){
                            console.error('FS', err);
                        });
                        return res.status(400).json(err);
                    }

                    res.status(200).json({ message : "Success"  });
                });
            })
            .catch(function(err) {
                console.log('bcrypt', err);
                fs.unlink(req.file.path, function(err) {
                    console.error('FS', err);
                });
                return res.status(400).json(err);
            });
    });
};

module.exports.picValidation = function(req, res, next) {
    const upload = require('../middleware/upload');

    upload.single('pic')(req, res, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Server error');
        }
        next();
    })
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
            if (req.file)
                fs.unlink(req.file.path, function(err) {
                    if (err) console.error('FS', err);
                });
            console.log(result.useFirstErrorOnly().mapped());
            return res.status(400).json({errors: result.useFirstErrorOnly().mapped()});
        }

        User.findById(req.payload._id, function(err, user){
            if (err) {
                if (req.file)
                    fs.unlink(req.file.path, function (err) {
                        if (err) console.error('FS', err);
                    });
                return res.status(500).json(err);
            }

            user.username = req.body.username;
            user.email = req.body.email;
            user.firstname = req.body.firstname;
            user.lastname = req.body.lastname;
            if (req.file && req.file.filename)
                user.pic = req.file.filename;

            if (req.body.password) {
                user.password = req.body.password;
                user.hashPassword()
                    .then(() => {
                        user.save(function(err){
                            if (err) {
                                if (req.file)
                                    fs.unlink(req.file.path, function (err) {
                                        if (err) console.error('FS', err);
                                    });
                                return res.status(500).json(err);
                            }
                            let token = user.generateJwt();
                            return res.status(200).json({ token: token });
                        })
                    });
            } else {
                user.save(function(err){
                    if (err) {
                        if (req.file)
                            fs.unlink(req.file.path, function (err) {
                                if (err) console.error('FS', err);
                            });
                        return res.status(500).json(err);
                    }
                    let token = user.generateJwt();
                    return res.status(200).json({ token: token });
                })
            }
        });
    });
};


module.exports.me = function(req, res) {
    if (!req.payload._id)
        return res.status(401).json({ "message" : "UnauthorizedError: private profile" });

    User.findOne({ _id: req.payload._id},  {_id:1, username:1, email:1, firstname:1, lastname:1, pic:1, lang:1}, function(err, user){
        if (err)
            return res.status(500).json(err);
        return res.status(200).json(user);
    })
};

module.exports.uid = function (req, res) {
    User.findOne({ _id: req.params.uid}, {_id:1, username:1, email:1, firstname:1, lastname:1, pic:1, lang:1}, function(err, user){
        if (err)
            return res.status(500).json(err);
        return res.status(200).json(user);
    })
};

module.exports.updateLang = function (req, res) {
  if(!req.payload._id)
      return res.status(401).json({"message" : "UnauthorizedError: private profile"});

  if (['fre', 'eng'].indexOf(req.params.lang) === -1)
      return res.status(401).json({"message": "lang not allowed"});

  User.findOneAndUpdate({_id: req.payload._id}, { $set: { lang : req.params.lang}}, {new: true}, function (err, user) {
      if (err)
          return res.status(500).json(err);
      let token = { token: user.generateJwt() };
      return res.status(200).json(token);
  })
};

module.exports.forgotPassword = function (req, res) {
    if (!req.body.email)
        return res.status(400).json("error");

    User.findOne({email : req.body.email}, function (err, result) {
        if (err)
            return res.status(500).json(err);

        if (!result)
            return res.status(200).json('ok');

        let token = sha256(req.body.email + Date.now()).toString();
        result.token = token;
        result.save(function (err) {
            if(err)
                return res.status(500).json(err);
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'matcha.4242@gmail.com',
                    pass: 'matcha42'
                }
            });

            let link = "http://localhost:3001/password/update/"+token;

            let mailOptions = {
                from: 'Hypertube', // sender address
                to: req.body.email, // list of receivers
                subject: 'Hypertube - Reset Password', // Subject line
                text: 'To reset your password, please click the link below or copy/paste to your browser :\n\n' +link
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).json(err);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
                return res.status(200).json('ok');
            });
        });
    });
};

module.exports.verifyToken = function (req, res) {
    if (!req.params.token)
        return res.status(400).json("page not found");
    User.findOne({token: req.params.token}, function (err, result) {
        if (err)
            return res.status(500).json(err);
        if(result)
        {
            return res.status(200).json({message : "token OK"})
        }
        else
            return res.status(400).json({message : "token not valid"});
    })
};

module.exports.updatePassword = function (req, res) {

    req.checkBody('password', 'Invalid password').notEmpty().matches(/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/);
    req.checkBody('password', 'Password do not match').equals(req.body.passwordConf);
    req.checkBody('token', "token not found").notEmpty();

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.useFirstErrorOnly().mapped() });
        }
        else
        {
            User.findOne({token: req.body.token}, function (err, user) {
                if (err)
                    return res.status(500).json(err);
                if (!user)
                    return res.status(400).json({message : "user not found"});
                user.password = req.body.password;
                user.token = '';
                user.hashPassword().then(function () {
                    user.save(function(err) {
                        if (err) {
                            return res.status(400).json(err);
                        }
                        res.status(200).json({ message : "Password Updated"});
                    });
                }).catch(function (err) {
                    return res.status(500).json(err);
                })
            })
        }
    });
};