const express = require('express');
const keys = require('../config/keys');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const db = require('../db/model.js');
const app = express();
const cors = require('cors')
const BreweryDb = require('brewerydb-node');
const brewdb = new BreweryDb(keys.BREWKEY);

const cookieSession = require ('cookie-session');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy

// mongoose.connect('mongodb://localhost:27017/BeerApp');
mongoose.connect(`mongodb://${keys.DBUSER}:${keys.DBPASSWORD}@ds125489.mlab.com:25489/beer-db`, {useMongoClient: true});

app.use(
  cookieSession({
    //1month
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.COOKIEKEY],
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  console.log('USER:', user);
  done(null, user[0]._id)
});

passport.deserializeUser((id, done) => {
  db.findUserById(id, done);
});

passport.use(new GoogleStrategy({
    clientID: keys.CLIENTID,
    clientSecret: keys.CLIENTSECRET,
    callbackURL: "http://localhost:3001/auth/google/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    let currentUser = {
      user_id: profile.id,
      user_name: profile.displayName,
    };
    db.findOrCreate(currentUser, done);
  }
));

app.get('/auth/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
  })
);

app.get('/auth/google/callback', 
  passport.authenticate('google', {
    successRedirect: '/Home',
    failureRedirect: '/Login'
  })
);

app.get('/test/getuser', (req, res) => {
  res.send(req.user);
});

app.get('/api/logout', (req ,res) => {
  req.logout();
  res.redirect('/Login');
})

app.use(cors())

app.use(morgan('dev'));

// setting up webpack dev
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const config = require('../webpack.config.js');
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))


// app.get('/:id', (req, res) => res.sendFile(path.join(__dirname + '/../public/index.html')));

//app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/../public/index.html')));
// app.use('/content', express.static(path.join(__dirname + '/../public')));
// app.use('/Home', express.static(path.join(__dirname + '/../public')));
// app.use('/MyList', express.static(path.join(__dirname + '/../public')));
app.use('/Login', express.static(path.join(__dirname + '/../public')));

//starting new stuff
app.use('/Home', (req, res, next) => {
  //console.log('HOME', req.user);
  if(req.user) {
    res.sendFile(path.join(__dirname + '/../public/index.html'));
  }else {
    res.redirect('/Login');
  }
});

app.get('/MyList', (req, res) => {
  if(req.user) {
    //console.log('IN MYLIST HANDLER');
    res.sendFile(path.join(__dirname + '/../public/index.html'));
  }else {
    res.redirect('/Login');
    res.send();
  }
});

app.get('/', (req, res) => {
  let idToSearch;
  if(req.user){
    idToSearch = req.user[0].user_id;
    //console.log('ID', idToSearch);
  }else {
    //console.log('no ID redirection to Login');
    res.redirect('/Login');
  }
  //console.log('TESTUSER', typeof(idToSearch));
  db.findUserByUserId(idToSearch, (result) => {
    //console.log('DB RETURN', result, result.length);
    if(result.length !== 0) {
      res.redirect('/Home')
    }else {
      //console.log('redirection to login');
      res.redirect('/Login');
    }
  });
});

////old stuff
app.use('/api/name/:name', (req, res) => {
  const name = req.params.name;
  brewdb.search.all({ q: `${name}*` }, (err, data) => {
    if (err) {
      throw err;
    }
    res.send(data);
  })
});

app.use('/api/picture/:id', (req, res) => {
  const id = req.params.id;
  brewdb.beer.getById(id, {}, (err, data) => {
    if (err) {
      throw err;
    }
    res.send(data);
  });
});

app.use('/api/allBeers', (req, res) => {
  db.findAll(req.user[0].user_id, (result) => {
    res.send(result);
  });
});

app.use('/api/removeBeer/:id', (req, res) => {
  let id = req.params.id;
  db.removeOne(id, req.user[0].user_id, (result) => {
    res.send(result);
  });
});

app.put('/api/beerUpdate/:id', (req,res) => {
  console.log(req.body);
  let id = req.params.id;
  let obj = {};
  let what = req.body.what;
  let how = req.body.how;
  obj[what] = how;
  db.updateBeer(id, obj, req.user[0].user_id, (result) => {
    res.send(result);
  })
})

app.use('/api/addBeer/:beerToStore', (req, res) => {
  let id = req.params.beerToStore;
  let user_id = req.user[0].user_id;
  console.log(req.user);
  brewdb.beer.getById(id, {}, (err, data) => { 
    var newBeer = {
      beer_id: data.id,
      beer_name: data.name,
      beer_abv: data.abv,
      beer_description: data.description || data.style.description,
      beer_styleName: data.style.name,
      beer_picture: data.labels && data.labels.icon || 'https://i.imgur.com/wUogHsD.png',
      beer_drankIt: false,
      beer_rating: 0,
      beer_personalDescription: '',
      beer_user_id: user_id,
      beer_uniqueId: user_id + data.id,
    };
    db.insert(newBeer, (err) => {
      if(err) throw err;
      res.send();
    });
  });
});


module.exports = app;