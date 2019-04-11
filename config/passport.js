const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
// const mongoose = require('mongoose');
const User = require('../models/User');
const key = require('../config/key');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key.secretOrKey;

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_padyload, done) => {
        User.findById(jwt_padyload.id)
            .then(user => {
                if (user) {
                    return done(null, user);
                }
                return done(null, false)
            })
            .catch(err => console.log(err));
    }))
}