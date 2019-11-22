const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/user').User;

module.exports = function(passport) {
    passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password' },
        (username, password, done) => {
            // Match user
            User.findOne({
                username: username
            }).then(user => {
                if (!user) {
                    return done(null, false, { message: 'That username is not registered' });
                }
                // Match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Password incorrect' });
                    }
                });
            });
        }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};