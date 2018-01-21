const express = require('express');
const app = express();
const Twit = require('twit');
const config = require('./config')
const T = new Twit(config);
const fs = require('fs');

app.set('view engine', 'pug');

app.use((req, res, next) => {
      T.get('account/verify_credentials', function(err, data, response) {
        req.account = data;
        next();
      }
    )},
    (req, res, next) => {
      T.get('statuses/user_timeline', { screen_name: 'Ghir_Dario', count: 5 }, function(err, data, response) {
        req.tweets = data;
        next();
      }
    )},
    (req, res, next) => {
      T.get('friends/list', { screen_name: 'Ghir_Dario', count: 5 }, function(err, data, response) {
        req.friends = data.users;
        next();
    }
    )},
    (req, res, next) => {
      T.get('direct_messages/sent', { count: 5 }, function(err, data, response) {
        req.messages = data;
        next();
    }
    )}
)

app.use(express.static('public'));

app.get('/', (req, res) => {
  const { account, tweets, friends, messages } = req;
  res.render('index', { account, tweets, friends, messages });
})


app.listen(3000, () => {
    console.log('The application is running on localhost:3000!')
});
