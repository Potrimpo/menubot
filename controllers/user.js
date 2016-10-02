'use strict';

var UserRepo = require('../repositories/UserRepository.js');

exports.getLogin = function(req, res) {
  if (req.user)
    return res.redirect('/account');

  res.render('account/login', {
    title: 'Login'
  });
};

exports.logout = (req, res) => {
  req.logout();
  res.locals.user = null;
  return res.redirect('/landing');
};

exports.deleteAccount = function(req, res) {
  UserRepo.removeUserById(req.user.id)
    .then(function() {
      req.logout();
      req.flash('info', { msg: 'Your account has been deleted.' });
      res.json({ success: true });
    });
};

exports.getOauthUnlink = function(req, res, next) {
  var provider = req.params.provider;

  UserRepo.unlinkProviderFromAccount(provider, req.user.id)
    .then(function() {
      req.flash('info', { msg: provider + ' account has been unlinked.' });
      res.redirect('/landing');
    })
    .catch(function(err) {
      return next(err);
    });
};
