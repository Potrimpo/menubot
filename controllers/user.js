'use strict';

const bcrypt = require('bcrypt'),
  db = require('../repositories/site/UserRepository.js');

const rounds = 12;

exports.validKey = (req, res, next) =>
  db.getKey(req.body.number)
    .then(key =>
      bcrypt.compare(req.body.password, key.password)
    )
    .then(status =>
      status ? next() : res.redirect('/landing')
    )
    .catch(() =>
      res.status(500).redirect('/landing')
    );

exports.logout = (req, res) => {
  req.logout();
  res.locals.user = null;
  return res.redirect('/landing');
};

exports.deleteAccount = function(req, res) {
  db.removeUserById(req.user.id)
    .then(function() {
      req.logout();
      req.flash('info', { msg: 'Your account has been deleted.' });
      res.json({ success: true });
    });
};

exports.getOauthUnlink = function(req, res, next) {
  const provider = req.params.provider;

  db.unlinkProviderFromAccount(provider, req.user.id)
    .then(function() {
      req.flash('info', { msg: provider + ' account has been unlinked.' });
      res.redirect('/landing');
    })
    .catch(function(err) {
      return next(err);
    });
};
