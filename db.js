const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const uniqueValidator = require("mongoose-unique-validator");

// reviews
// * each review must have a related user
// * they also have a date when this review was posted
const Review = new mongoose.Schema({
  username: {type: String, required: true},
  verdict: {type: String, required: true},
  createdAt: {type: Date, default: Date.now, required: true}
});

// resturant
// * each resturant has a name, cuisine associated with it,
// * borough, price point, and pictures
// * users can post reviews
const Resturant = new mongoose.Schema({
  name: {type: String, required: true},
  namelower: {type: String, required: true},
  cuisine: {type: String, required: true},
  borough: {type: String, required: true},
  price: {type: String, required: true},
  picture: {type: String, required: false},
  reviews: [Review]
});

// users
// * our site requires authentication
// * so users have a username and password
// * they also can have 0 or more lists
const User = new mongoose.Schema({
  // username provided by authentication plugin
  // password hash provided by authentication plugin
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  resturants: [Resturant]
  
});

User.plugin(uniqueValidator);

User.plugin(passportLocalMongoose);

mongoose.model('User',User);
mongoose.model('Review', Review);
mongoose.model('Resturant', Resturant);


// is the environment variable, NODE_ENV, set to PRODUCTION? 
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/final';
}

mongoose.connect(dbconf, {useNewUrlParser: true, useUnifiedTopology: true});


// Users.register({username:'paul', active: false}, 'paul');
// Users.register({username:'jay', active: false}, 'jay');
// Users.register({username:'roy', active: false}, 'roy');