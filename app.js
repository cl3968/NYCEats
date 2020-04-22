require('./db.js');

const mongoose = require('mongoose');

const Resturant = mongoose.model('Resturant');
const Review = mongoose.model('Review');
const User = mongoose.model('User');

const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const flash = require("express-flash");
const bcrypt = require('bcrypt');
require('./passport.js')(passport);


const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

// enable sessions
const session = require('express-session');
const sessionOptions = {
    secret: 'secret cookie thang (store this elsewhere!)',
    resave: true,
      saveUninitialized: true
};
app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// body parser setup
app.use(bodyParser.urlencoded({ extended: false }));

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
		Resturant.find({name: req.query.name, cuisine: req.query.cuisine, borough: req.query.borough, price: req.query.price}, (err, result) => {
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
		Resturant.find({name: req.query.name}, (err, result) => {
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

app.get('/resturant', (req, res) =>{
	res.render('resturant');
});

app.post('/resturant', (req, res) =>{
	if (req.body!==undefined){
		new Review({
			username: req.body.username,
			verdict: req.body.verdict,
			createdAt: Date()

		}).save(function(err, review){
			res.redirect('/');
		});
	}
	else{
		res.redirect('/resturant');
	}
})

app.get('/login', function(req, res, next) { 
	res.render('login');
}); 

app.post('/login', 
  passport.authenticate('local-login', { 
  	successRedirect: '/',
  	failureRedirect: '/login',
  	failureFlash: true
}));

app.get('/signup', function(req, res) { 
  res.render('signup');
}); 

app.post('/signup', 
	passport.authenticate('local-signup',{
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash: true

}));


app.listen(3000);