const express = require('express');
const app = express();
const Twit = require('twit');
const config = require('./config')
const T = new Twit(config);
const fs = require('fs');
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false}));


app.use(
    (req, res, next) => {
      T.get('account/verify_credentials', function(err, data, response) {
        req.account = data;
        next();
      }
    )},
    (req, res, next) => {
      T.get('statuses/user_timeline', { screen_name: req.account.screen_name, count: 5 }, function(err, data, response) {
        req.tweets = data;
        next();
      }
    )},
    (req, res, next) => {
      T.get('direct_messages/sent', { count: 5 }, function(err, data, response) {
        req.messages = data;
        next();
    }
  )},
    (req, res, next) => {
      T.get('friends/list', { screen_name: req.account.screen_name, count: 5 }, function(err, data, response) {
        req.friends = data.users;
        next();
    }
    )}
)


app.get('/', (req, res) => {
  const { account, tweets, friends, messages } = req;
  res.render('index', { account, tweets, friends, messages });
})

app.post('/', (req, res) => {
  T.post('statuses/update', { status: req.body.tweet }, function(err, data, response) {
    res.json(data)
  })
})

app.use((req, res, next) => {
    const err = new Error('The page you are looking for is not available, sorry.');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
  res.locals.error = err;
  res.status(err.status);
  res.render('error');
});

app.listen(3000, () => {
    console.log('The application is running on localhost:3000!')
});
