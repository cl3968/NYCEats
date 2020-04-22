//passport config
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; 
// load up the user model 
const mongoose = require('mongoose');
const User = mongoose.model('User');


module.exports = function(passport) { 
  // passport init setup 
  // serialize the user for the session 
  passport.serializeUser(function(user, done) { 
      done(null, user.id); 
  }); 
  //deserialize the user 
  passport.deserializeUser(function(id, done) { 
      User.findById(id, function(err, user) { 
          done(err, user); 
      }); 
  }); 
  // using local strategy 
  passport.use('local-login', new LocalStrategy({ 
      //change default username and password, to username 
      //and password 
      usernameField : 'username', 
      passwordField : 'password', 
      passReqToCallback : true 
  }, 
  function(req, username, password, done) { 
      if (username) 
      // format to lower-case 
      username = username.toLowerCase(); 
      // process asynchronous 
      process.nextTick(function() { 
          User.findOne({ 'local.username' :  username }, 
           function(err, user)
        { 
          // if errors 
         if (err) 
           return done(err); 
         // check errors and bring the messages 
         if (!user) 
           return done(null, false, req.flash('loginMessage',
           'No user found.')); 
        if (!user.validPassword(password)) 
          return done(null, false, req.flash('loginMessage',
          'Wohh! Wrong password.')); 
        // everything ok, get user 
        else 
          return done(null, user); 
        }); 
      }); 
   })); 
  // Signup local strategy 
  passport.use('local-signup', new LocalStrategy({ 
      // change default username and password, to username and 
     //  password 
      usernameField : 'username', 
      passwordField : 'password', 
      passReqToCallback : true 
  }, 
  function(req, username, password, done) { 
      if (email) 
      // format to lower-case 
      username = username.toLowerCase(); 
      // asynchronous 
      process.nextTick(function() { 
    // if the user is not already logged in: 
    if (!req.user) { 
      User.findOne({ 'local.username' :  username },
      function(err, user) { 
      if (err){
        return done(err); 
      }
    // check username 
      if (user) { 
        return done(null, false, req.flash('signupMessage',
        'Wohh! the username is already taken.')); 
      }
          else { 
        // create the user 
        var newUser = new User(); 
        // Get user name from req.body 
        newUser.local.name = req.body.name; 
        newUser.local.username = username; 
        newUser.local.password =
        newUser.generateHash(password); 
        // save data 
              newUser.save(function(err) { 
            if (err)
              throw err; 
            return done(null, newUser); 
            }); 
           } 
        }); 
       } 
       else { 
          return done(null, req.user); 
       }
   }); 
  })); 
}; 