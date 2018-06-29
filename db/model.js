var mongoose = require('mongoose');

var myBeers = mongoose.Schema({
  beer_id: {type: String, unique: true},
  beer_name: String,
  beer_abv: String,
  beer_description: String,
  beer_styleName: String,
  beer_picture: String,
  beer_drankIt: Boolean,
  beer_rating: Number,
  beer_personalDescription: String,
  beer_user_id: String,
});

var userSchema = mongoose.Schema({
  user_id: {type: String, unique: true},
  user_name: String,
});

var beers = mongoose.model('beers', myBeers);
var users = mongoose.model('users', userSchema);

function findAll(callback) {
  beers.find().then((result) => callback(result));
}

function findOne(id, callback) {
  beers.find({beer_id: id}).then((result) => callback(result));
}

function removeOne(id, callback) {
  beers.remove({beer_id: id}).then((result) => callback(result));
}

function insert(id, callback) {
  beers.create(id, callback);
}

function updateBeer(id, objToUpdate, callback) {
  beers.update({beer_id: id}, {$set: objToUpdate}, callback);
}

function findOrCreate(user, callback) {
  let id = user.user_id;
  users.find({user_id: id}).then((result) => {
    if(result.length !== 0) {
      callback(null, result);
    }else {
      users.create(user,callback).then((result) => {
        callback(null, result);
      });
    }
  });
}

function findUserById(id, callback) {
  users.find({_id: id}).then((result) => {
    callback(null, result);
  });
}

function findUserByUserId(user_id, callback) {
  users.find({user_id: user_id}).then((result) => {
    callback(result);
  })
}

exports.findAll = findAll;
exports.insert = insert;
exports.beers = beers;
exports.removeOne = removeOne;
exports.updateBeer = updateBeer;
exports.findOrCreate = findOrCreate;
exports.findUserById = findUserById;
exports.findUserByUserId = findUserByUserId;

// id: response.data[0].id,
// name: response.data[0].name,
// abv: response.data[0].abv,
// description: response.data[0].description,
// styleName: response.data[0].style.shortName,
