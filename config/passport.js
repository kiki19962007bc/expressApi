const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');

const secret = require('./keys').secret;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secret;
module.exports = (passport) => {
    passport.use(new JwtStrategy(opts, (payload, done) => {
        User.findById(payload.id)
            .then(user => {
                if (user) {
                    console.log(user.name);
                    return done(null, user);
                }
                else {
                    console.log('no user');
                    return done(null, false);
                }
            })
    }))
}