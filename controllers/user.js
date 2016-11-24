'use strict';

const db = require('../repositories/site/UserRepository.js');

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
