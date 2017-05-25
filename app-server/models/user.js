const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true, uniqueCaseInsensitive: true },
    email: { type: String, required: true, unique: true, uniqueCaseInsensitive: true },
    password: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    pic: { type: String },
    facebookId: { type: String, },
    fortytwoId: { type: String, },
    lang: { type: String, enum: ['fre', 'eng'], default: 'eng' },
    token: {type : String}
});

/**
 * Hash the user password
 * @returns {Promise}
 */
userSchema.methods.hashPassword = function() {
    const self = this;
    return new Promise(function(resolve, reject) {
        bcrypt.hash(self.password, 10)
            .then(function(hash) {
                self.password = hash;
                return resolve();
            })
            .catch(function(err) {
                return reject(err);
            });
    });
};

/**
 * Call bcrypt.compare. Check doc to get returns value
 * @param password
 * @return {Promise}
 */
userSchema.methods.checkPassword = function(password) {
    return bcrypt.compare(password, this.password)
};

userSchema.methods.generateJwt = function() {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        pic: this.pic,
        _id: this._id,
        username: this.username,
        lang: this.lang,
        exp: parseInt(expiry.getTime() / 1000)
    }, config.TOKEN_SECRET);
};


userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);
