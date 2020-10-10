// config/passport.js

// load all the things we need

var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20');
const refresh = require('passport-oauth2-refresh');
const { OAuthStrategy } = require('passport-oauth');
const { OAuth2Strategy } = require('passport-oauth');
const { Strategy: LinkedInStrategy } = require('passport-linkedin-oauth2');
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
    if (req.user) {
        User.findOne({ google: profile.id }, (err, existingUser) => {
          if (err) { return done(err); }
          if (existingUser && (existingUser.id !== req.user.id)) {
            //req.flash('errors', { msg: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
            done(err);
          } else {
            User.findById(req.user.id, (err, user) => {
              if (err) { return done(err); }
              user.google = profile.id;
            //   user.tokens.push({
            //     kind: 'google',
            //     accessToken,
            //     accessTokenExpires: moment().add(params.expires_in, 'seconds').format(),
            //     refreshToken,
            //   });
              user.profile.name = user.profile.name || profile.displayName;
              user.profile.gender = user.profile.gender || profile._json.gender;
              user.profile.picture = user.profile.picture || profile._json.picture;
              user.save((err) => {
                //req.flash('info', { msg: 'Google account has been linked.' });
                done(err, user);
              });
            });
          }
        });
      } else {
        User.findOne({ google: profile.id }, (err, existingUser) => {
          if (err) { return done(err); }
          if (existingUser) {
            return done(null, existingUser);
          }
          User.findOne({ email: profile.emails[0].value }, (err, existingEmailUser) => {
            if (err) { return done(err); }
            if (existingEmailUser) {
              //req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.' });
              done(err);
            } else {
              const user = new User();
              user.email = profile.emails[0].value;
              user.google = profile.id;
            //   user.tokens.push({
            //     kind: 'google',
            //     accessToken,
            //     accessTokenExpires: moment().add(params.expires_in, 'seconds').format(),
            //     refreshToken,
            //   });
              user.profile.name = profile.displayName;
              user.profile.gender = profile._json.gender;
              user.profile.picture = profile._json.picture;
              user.save((err) => {
                done(err, user);
              });
            }
          });
        });
      }
}));

/**
 * Sign in with LinkedIn.
 //Need to get a client id and secret to make it work
passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_ID,
    clientSecret: process.env.LINKEDIN_SECRET,
    callbackURL: `${process.env.BASE_URL}/auth/linkedin/callback`,
    scope: ['r_liteprofile', 'r_emailaddress'],
    passReqToCallback: true
  }, (req, accessToken, refreshToken, profile, done) => {
    if (req.user) {
      User.findOne({ linkedin: profile.id }, (err, existingUser) => {
        if (err) { return done(err); }
        if (existingUser) {
          req.flash('errors', { msg: 'There is already a LinkedIn account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
          done(err);
        } else {
          User.findById(req.user.id, (err, user) => {
            if (err) { return done(err); }
            user.linkedin = profile.id;
            user.tokens.push({ kind: 'linkedin', accessToken });
            user.profile.name = user.profile.name || profile.displayName;
            user.profile.picture = user.profile.picture || profile.photos[3].value;
            user.save((err) => {
              if (err) { return done(err); }
              req.flash('info', { msg: 'LinkedIn account has been linked.' });
              done(err, user);
            });
          });
        }
      });
    } else {
      User.findOne({ linkedin: profile.id }, (err, existingUser) => {
        if (err) { return done(err); }
        if (existingUser) {
          return done(null, existingUser);
        }
        User.findOne({ email: profile.emails[0].value }, (err, existingEmailUser) => {
          if (err) { return done(err); }
          if (existingEmailUser) {
            req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with LinkedIn manually from Account Settings.' });
            done(err);
          } else {
            const user = new User();
            user.linkedin = profile.id;
            user.tokens.push({ kind: 'linkedin', accessToken });
            user.email = profile.emails[0].value;
            user.profile.name = profile.displayName;
            user.profile.picture = user.profile.picture || profile.photos[3].value;
            user.save((err) => {
              done(err, user);
            });
          }
        });
      });
    }
  }));
*/
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['name', 'email', 'link', 'locale', 'timezone', 'gender'],
    passReqToCallback: true
  }, (req, accessToken, refreshToken, profile, done) => {
    console.log(req, profile);
    if (req.user) {
      User.findOne({ facebook: profile.id }, (err, existingUser) => {
        if (err) { return done(err); }
        if (existingUser) {
          //req.flash('errors', { msg: 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
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
            //req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.' });
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
