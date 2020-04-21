//passport config
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//load up the user model
const User = require('./user');