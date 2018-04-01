const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const db = require('../db/model.js');
const app = express();
const cors = require('cors')
const BreweryDb = require('brewerydb-node');
const brewdb = new BreweryDb('abeed219f6f7bee05b0e1e08d4f0d7ac');

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

mongoose.connect('mongodb://localhost:27017/BeerApp');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

// app.get('/:id', (req, res) => res.sendFile(path.join(__dirname + '/../public/index.html')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/../public/index.html')));
app.use('/content', express.static(path.join(__dirname + '/../public')));
app.use('/MyList', express.static(path.join(__dirname + '/../public')));

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
  db.findAll((result) => {
    res.send(result);
  });
});

app.use('/api/removeBeer/:id', (req, res) => {
  let id = req.params.id;
  db.removeOne(id, (result) => {
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
  db.updateBeer(id, obj, (result) => {
    res.send(result);
  })
})

app.use('/api/addBeer/:beerToStore', (req, res) => {
  let id = req.params.beerToStore;
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
    };
    db.insert(newBeer, (err) => {
      if(err) throw err;
      res.send();
    });
  });
});


module.exports = app;