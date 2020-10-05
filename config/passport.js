// config/passport.js

// load all the things we need

var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20');
const refresh = require('passport-oauth2-refresh');
const { OAuthStrategy } = require('passport-oauth');
const { OAuth2Strategy } = require('passport-oauth');
const _ = require('lodash');
const passport = require('passport');
const moment = require('moment');

// load up the user model
var User       = require('../models/userModel');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});
  
passport.use(new GoogleStrategy({
    //options for google strategy
    callbackURL: '/auth/google/callback',
    clientID: process.env.GOOGLE_ID,//'174619629981-lkihpt3dh6oddv1rlasvqueq60qo7p1p.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET,//'3-PjucTRjit7p1MjcK7Moa9Q',
    passReqToCallback: true

}, (req, accessToken, refreshToken, profile, done) =>{
    //passport call back function
    //Check if the suer already exists in the DB
    //console.log(user.profile.gender || profile._json.gender);
    User.findOne({googleId: profile.id}).then((currentUser) => {
        if(currentUser){
            // already have this user
            console.log('user is: ', currentUser);
            done(null, currentUser);
        } else {
            // if not, create user in our db
            new User({
                googleId: profile.id,
                displayname: profile.displayName,
                gender: profile._json.gender,
                email: profile.email
                //thumbnail: profile._json.image.url
            }).save().then((newUser) => {
                console.log('created new user: ', newUser);
                done(null, newUser);
            });
        }
    });
}   
));


passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['name', 'email', 'link', 'locale', 'timezone', 'gender'],
    passReqToCallback: true
  }, (req, accessToken, refreshToken, profile, done) => {
    if (req.user) {
      User.findOne({ facebook: profile.id }, (err, existingUser) => {
        if (err) { return done(err); }
        if (existingUser) {
          req.flash('errors', { msg: 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
          done(err);
        } else {
          User.findById(req.user.id, (err, user) => {
            if (err) { return done(err); }
            user.facebook = profile.id;
            //user.tokens.push({ kind: 'facebook', accessToken });
            user.profile.name = user.profile.name || `${profile.name.givenName} ${profile.name.familyName}`;
            user.profile.gender = user.profile.gender || profile._json.gender;
            user.profile.picture = user.profile.picture || `https://graph.facebook.com/${profile.id}/picture?type=large`;
            user.save((err) => {
              req.flash('info', { msg: 'Facebook account has been linked.' });
              done(err, user);
            });
          });
        }
      });
    } else {
      User.findOne({ facebook: profile.id }, (err, existingUser) => {
        if (err) { return done(err); }
        if (existingUser) {
          return done(null, existingUser);
        }
        User.findOne({ email: profile._json.email }, (err, existingEmailUser) => {
          if (err) { return done(err); }
          if (existingEmailUser) {
            req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.' });
            done(err);
          } else {
            const user = new User();
            user.email = profile._json.email;
            user.facebook = profile.id;
            //user.tokens.push({ kind: 'facebook', accessToken });
            user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
            user.profile.gender = profile._json.gender;
            user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
            user.profile.location = (profile._json.location) ? profile._json.location.name : '';
            user.save((err) => {
              done(err, user);
            });
          }
        });
      });
    }
  }));
