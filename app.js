const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const passport = require('passport');
const path = require('path');
// routes
const users = require('./routes/users');
const categories = require('./routes/Categories');
const posts = require('./routes/Posts');
// passpost
const passpost = require('passport');



// db config
const db = require('./config/key').mongoURL;

// connect mongodb
mongoose.connect(db)
    .then(() => console.log('Mongodb connected successfully !!!'))
    .catch(err => console.log(err));

// body middalware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// passport middleware
app.use(passport.initialize());

// passport config
require('./config/passport')(passport);


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// app router
app.use('/users', users);
app.use('/categories', categories);
app.use('/posts', posts);

// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
    // set static folder
    app.use(express.static("client/build"))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.get('/', (req, res) => res.json("I am NODEJS"))
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is listening on port ${port}`));