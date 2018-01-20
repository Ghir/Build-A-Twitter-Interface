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
        res.send(data);
        req.tweets = data;
        next();
        // mydata.name = data[0].user.name;
        // mydata.screenName = data[0].user.screen_name;
        // mydata.profileImage = data[0].user.profile_image_url;
        // for (let i = 0; i < data.length; i++) {
        //   mydata.tweets[i].content = data[i].text;
        //   mydata.tweets[i].retweets = data[i].retweet_count;
        //   mydata.tweets[i].likes = data[i].favorite_count;
        //   mydata.tweets[i].date = data[i].created_at.slice(0, 10);
        // }
      }
    )},
    (req, res, next) => {
      T.get('friends/list', { screen_name: 'Ghir_Dario', count: 5 }, function(err, data, response) {
        req.friends = data;
        next();
      //   for (let i = 0; i < data.users.length; i++) {
      //     mydata.friends[i].profileImage = data.users[i].profile_image_url;
      //     mydata.friends[i].realName = data.users[i].name;
      //     mydata.friends[i].screenName = data.users[i].screen_name;
      //   }
      // })
    }
    )},
    (req, res, next) => {
      T.get('direct_messages/sent', { count: 5 }, function(err, data, response) {
        req.messages = data;
        next();
      //   for (let i = 0; i < data.length; i++) {
      //     mydata.messages[i].body = data[i].text;
      //     mydata.messages[i].date = data[i].created_at.slice(0, 19);
      //   }
      // })
    }
    )}
)

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.locals.tweets = req.tweets;
  res.locals.friends = req.friends;
  res.locals.messages = req.messages;
  res.render('index');
})


app.listen(3000, () => {
    console.log('The application is running on localhost:3000!')
});
