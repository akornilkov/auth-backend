var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var session = require('express-session');
var cors = require('cors');
var MongoDB = require('./models/user').Mongo;

MongoDB.connect('mongodb://localhost:27017/database', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('MongoDB is connected')
}).catch(error => {
    console.log('MongoDB is NOT connected.' + error)
})

require('./controllers/passport')(passport);

var app = express();
app.use(cors());
app.use(logger('short'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static('public'));
// Express session
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


app.use('/users', require('./routes/users'));

module.exports = app;