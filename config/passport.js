'use strict';

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var secrets = require('./secrets');
var { User } = require('../database/models/index');
var UserRepo = require('../repositories/UserRepository');

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
    .catch(error => done(error));
});

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

/**
 * Sign in with Facebook.
 */
passport.use(new FacebookStrategy(secrets.facebook, function(req, accessToken, refreshToken, profile, done) {
  if (req.user) {
    UserRepo.linkFacebookProfile(req.user.id, accessToken, refreshToken, profile)
      .then(function(user) {
        req.flash('info', { msg: 'Facebook account has been linked.' });
        done(null, user);
      })
      .catch(function(err) {
        req.flash('errors', { msg: err });
        done(null, false, { message: err });
      });
  } else {
    UserRepo.createAccFromFacebook(accessToken, refreshToken, profile)
      .then(function (user) {
        done(null, user);
      })
      .catch(function(error) { done(error); });
  }
}));

/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/landing');

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => req.user ? next() : res.redirect('/landing');