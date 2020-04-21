const mongoose = require('mongoose');

// users
// * our site requires authentication
// * so users have a username and password
// * they also can have 0 or more lists
const User = new mongoose.Schema({
  // username provided by authentication plugin
  // password hash provided by authentication plugin
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
  
});
// reviews
// * each review must have a related user
// * they also have a date when this review was posted
const Review = new mongoose.Schema({
  username: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  verdict:{type: String, required: true},
  createdAt: {type: Date, default: Date.now, required: true}
});
// resturant
// * each resturant has a name, cuisine associated with it,
// * borough, price point, and pictures
// * users can post reviews
const Resturant = new mongoose.Schema({
  name: {type: String, required: true},
  cuisine: {type: String, required: true},
  borough: {type: String, required: true},
  price: {type: String, required: true},
  // pictures: {type: Image, required: true},
  reviews: [Review]
});

mongoose.model('User', User);
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
 dbconf = 'mongodb://localhost/cl3968';
}

mongoose.connect(dbconf, {useNewUrlParser: true, useUnifiedTopology: true});