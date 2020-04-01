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
const Review = new mongoose.Schema({
  username: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  verdict:{type: String, required: true},
  rank: String,
  createdAt: {type: Date, required: true}
});
const Resturant = new mongoose.Schema({
  name: {type: String, required: true},
  cuisine: {type: String, required: true},
  borough: {type: String, required: true},
  price: {type: String, required: true},
  popularity: {type: Number, required: true},
  pictures: {type: Image, required: true},
  reviews: [Review]
});

mongoose.model('User', User);
mongoose.model('Review', Review);
mongoose.model('Resturant', Resturant);

mongoose.connect('mongodb://localhost/finalproject', {useNewUrlParser: true, useUnifiedTopology: true});