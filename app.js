require('./db.js');

const mongoose = require('mongoose');
const connectEnsureLogin = require('connect-ensure-login');

const Resturant = mongoose.model('Resturant');
const Review = mongoose.model('Review');
const User = mongoose.model('User');

const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const flash = require("express-flash");
// const bcrypt = require('bcrypt');
// require('./passport.js')(passport);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    User.findOne({
        _id: id
    }, '-password -salt', function(err, user) {
        done(err, user);
    });
});

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

passport.use(new LocalStrategy(function(username, password, done) {
    User.findOne({
        username: username,
        password: password
    }, function(err, user) {
        // This is how you handle error
        if (err) {return done(err);}
        // When user is not found
        if (!user) {return done(null, false);}
        // When password is not correct
        if (!user.authenticate(password)) {return done(null, false);}
        // When all things are good, we return the user
        return done(null, user);
     });
}));

const app = express();

// enable sessions
// const session = require('express-session');
// const sessionOptions = {
//     secret: 'secret cookie thang (store this elsewhere!)',
//     resave: true,
//       saveUninitialized: true
// };
// app.use(session(sessionOptions));

// app.use(express.static(__dirname));

// const bodyParser = require('body-parser');
const expressSession = require('express-session')({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
});

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// body parser setup
// app.use(bodyParser.urlencoded({ extended: false }));

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	// res.locals.user = req.user;
	// res.locals.authenticated = ! req.user.anonymous;
	if (req.session.count === undefined){
		req.session.count =0;
		res.locals.count =0;
	}
	else {
		req.session.count +=1;
		res.locals.count = req.session.count;
	}
	
	next();
});

app.get('/', (req, res) => {

	if (req.query.name===undefined && req.query.cuisine===undefined && req.query.borough===undefined && req.query.price===undefined){
		Resturant.find({}, (err, result) => {
			res.render('index', {resturants: result});
		});
	}

	else if(req.query.name!=="" && req.query.cuisine!=="" && req.query.borough!=="" && req.query.price!==""){
		Resturant.find({namelower: req.query.name.toLowerCase(), cuisine: req.query.cuisine, borough: req.query.borough, price: req.query.price}, (err, result) => {
			res.render('index', {resturants: result});
		});
	}
	else if(req.query.name!=="" && req.query.borough!=="" && req.query.price!==""){
		Resturant.find({name: req.query.name, borough: req.query.borough, price: req.query.price}, (err, result) => {
			res.render('index', {resturants: result});
		});

	}
	else if(req.query.name!=="" && req.query.cuisine!=="" && req.query.price!==""){
		Resturant.find({name: req.query.name, cuisine: req.query.cuisine, price: req.query.price}, (err, result) => {
			res.render('index', {resturants: result});
		});

	}
	else if(req.query.borough!=="" && req.query.cuisine!=="" && req.query.price!==""){
		Resturant.find({borough: req.query.borough, cuisine: req.query.cuisine, price: req.query.price}, (err, result) => {
			res.render('index', {resturants: result});
		});

	}
	else if(req.query.name!=="" && req.query.borough!==""){
		Resturant.find({name: req.query.name, borough: req.query.borough}, (err, result) => {
			res.render('index', {resturants: result});
		});

	}
	else if(req.query.name!=="" && req.query.cuisine!==""){
		Resturant.find({name: req.query.name, cuisine: req.query.cuisine}, (err, result) => {
			res.render('index', {resturants: result});
		});

	}
	else if(req.query.name!=="" && req.query.price!==""){
		Resturant.find({name: req.query.name, price: req.query.price}, (err, result) => {
			res.render('index', {resturants: result});
		});

	}
	else if(req.query.cuisine!=="" && req.query.borough!==""){
		Resturant.find({cuisine: req.query.cuisine, borough: req.query.borough}, (err, result) => {
			res.render('index', {resturants: result});
		});

	}
	else if(req.query.cuisine!=="" && req.query.price!==""){
		Resturant.find({cuisine: req.query.cuisine, price: req.query.price}, (err, result) => {
			res.render('index', {resturants: result});
		});

	}
	else if(req.query.price!=="" && req.query.borough!==""){
		Resturant.find({price: req.query.price, borough: req.query.borough}, (err, result) => {
			res.render('index', {resturants: result});
		});

	}
	else if(req.query.name!==""){
		Resturant.find({namelower: req.query.name.toLowerCase()}, (err, result) => {
			res.render('index', {resturants: result});
		});

	}
	else if(req.query.cuisine!==""){
		Resturant.find({cuisine: req.query.cuisine}, (err, result) => {
			res.render('index', {resturants: result});
		});
			
	}
	else if(req.query.borough!==""){
		Resturant.find({borough: req.query.borough}, (err, result) => {
			res.render('index', {resturants: result});
		});
	}
	else if(req.query.price!==""){
		Resturant.find({price: req.query.price}, (err, result) => {
			res.render('index', {resturants: result});
		});
	}
	else {
		Resturant.find({}, (err, result) => {
			res.render('index', {resturants: result});
		});
	}
	
	
});

app.get('/resturant',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res) => res.render('resturant')
);

app.post('/resturant', (req, res) =>{
	res.setHeader('Content-Type', 'text/html');

	if ((req.body!==undefined)&& (req.body!=="")){
		Resturant.findOne({namelower: req.body.name.toLowerCase()}, (err, result) =>{
			if (result!==null){
				result.reviews.push(new Review({
					username: req.body.username,
					verdict: req.body.verdict,
					createdAt: Date()
				}));
				// .save(function(err, review){			
				// res.redirect('/');
				result.save();

				User.findOne({username: req.body.username}, (err, userresult) =>{
				if (userresult!==null){
					userresult.resturants.push(result);
					// .save(function(err, review){			
					// res.redirect('/');
					userresult.save();
				}
				});
			}
		});          
		res.redirect(301, '/profile');
	}
	else{
		res.redirect(301, '/resturant');
	}
});

app.post('/login', (req, res, next) => {
  passport.authenticate('local', 
  (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
		const error = "Incorrect password. Try again!";
		return res.render('login', {error:error});
    }

    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }

      return res.redirect('/profile');
    });

  })(req, res, next);
});

app.get('/login',
  (req, res) => {res.render('login');}
);

function countcuisine(m){
	function newFn(n){
		let count=0;
		if (n===m){
			count++;
		}
		return count;
	}
	return newFn;
}

app.get('/profile',  
	connectEnsureLogin.ensureLoggedIn(),
	(req, res) => {
	let ans = 'You have ' + req.user.resturants.length + ' reviews.';
	if((req.query.cuisine!=="")&& (req.query.cuisine!==undefined)){
		// console.log((req.user.resturants))
		const newcount = countcuisine(req.query.cuisine);
		const res = req.user.resturants.map(x => newcount(x.cuisine));
		const total = res.reduce((acc, item)=> acc+= item, 0);
		const message = 'You have reviewed ' + total + ' ' + req.query.cuisine + ' resturants.';
		// req.flash('success', message);
		// res.redirect('/profile');
		// res.send(req.flash());
		ans = message;
	}
	res.render('profile', {resturants: req.user.resturants, username: req.user.username, num: ans});}
);

const cuisine = ["Thai", "Malaysian", "Chinese", "Korean", "Japanese", "Vietnamese", "Indian", "Indonesian"];
const rand1 = Math.floor(Math.random()*10);

app.get('/random', (req, res) =>{

	const result1 = cuisine.filter(cuisine => cuisine.length > rand1);

	const rand2 = Math.floor(Math.random()*result1.length);

	
	Resturant.findOne({"cuisine": result1[rand2]}, function(err,obj) {
	res.render('random', {resturants: obj});
	});
	// console.log(results);
	// res.render('random', {});
});

app.get('/signup', (req, res) =>{
	res.render('signup');
});

app.post('/signup', function(req,res){
  
	// attach POST to user schema
  const user = new User({ username: req.body.username, password: req.body.password, resturants: []});
  // save in Mongo
  user.save(function(err) {
    if(err) {
      const error = "Sorry, that username is already taken.";
      res.render('signup', {error: error});
    } else {
      // console.log('user: ' + user.email + " saved.");
      req.login(user, function(err) {
        if (err) {
          console.log(err);
        }
        return res.redirect('/login');
      });
    }
  });
});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

app.listen(process.env.PORT || 3000);
