const express = require('express'),
  app = express(),
  Twit = require('twit'),
  config = require('./config'),
  T = new Twit(config),
  bodyParser = require('body-parser');

app.use(express.static('public'));
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));


app.use(
  (req, res, next) => {
    T.get('account/verify_credentials', (err, data) => {
      req.account = data;
      next();
    }
    )
  },
  (req, res, next) => {
    T.get('statuses/user_timeline', { screen_name: req.account.screen_name, count: 5 }, (err, data) => {
      req.tweets = data;
      next();
    }
    )
  },
  (req, res, next) => {
    T.get('direct_messages/events/list', { count: 5 }, (err, data) => {
      req.messages = data.events;
      T.get('direct_messages/users/show', { user_id: 953573320561131521 }, () => {
        next();
      })
    }
    )
  },
  (req, res, next) => {
    T.get('friends/list', { screen_name: req.account.screen_name, count: 5 }, (err, data) => {
      req.friends = data.users;
      next();
    }
    )
  }
)


app.get('/', (req, res) => {
  const { account, tweets, friends, messages } = req;
  res.render('index', { account, tweets, friends, messages });
  res
})

app.post('/', (req, res) => {
  T.post('statuses/update', { status: req.body.tweet }, (err, data) => {
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

app.use((err, req, res) => {
  res.locals.error = err;
  if (err.status >= 100 && err.status < 600) {
    res.status(err.status);
  } else {
    res.status(500);
    res.render('error');
  }
});

app.listen(3000, () => {
  console.log('The application is running on localhost:3000!')
});
