const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const authenticate = passport.authenticate('local', { session: true });
// Load User model
const User = require('../models/user').User;

// Register
router.post('/register', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    if (!username || !password || !password2) {
        res.send({ Status: "Error", Message: "Please enter all fields" });
    }
    if (password != password2) {
        res.send({ Status: "Error", Message: "Passwords do not match" });
    }
    if (password.length < 6) {
        res.send({ Status: "Error", Message: "Password must be at least 6 characters" });
    }
    User.findOne({ username: username }).then(user => {
        if (user) {
            res.send({ Status: "Error", Message: "Username already exists" });
        } else {
            const newUser = new User({
                username,
                password
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) {
                        console.error(err);
                        res.send({ Status: "Error", Message: "Please try again later" });
                    }
                    newUser.password = hash;
                    newUser.save().then(user => {
                        res.send({ Status: "Success", Message: "You are now registered and can log in" });
                    }).catch(err => {
                        console.error(err);
                        res.send({ Status: "Error", Message: "Please try again later" });
                    });
                });
            });
        }
    });
});

// Login
router.post('/login', authenticate, (req, res) => {
    res.send({ Status: "Success", Message: `You are authorized as a ${req.user.username}` });
});

// Logout
router.get('/logout', (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).send({ Status: "Error", Message: "You have to be authorized to use this url" });
    }
    next();
}, (req, res) => {
    req.logout();
    res.send({ Status: "Success", Message: `You are successfully unauthorized` });
});

module.exports = router;