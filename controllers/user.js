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

// exports.deleteAccount = (req, res) =>
//   db.removeUserById(req.user.id)
//     .then(() => {
//       req.logout();
//       return res.json({ success: true });
//     });
//
// exports.getOauthUnlink = (req, res, next) => {
//   const provider = req.params.provider;
//
//   return db.unlinkProviderFromAccount(provider, req.user.id)
//     .then(() => {
//       req.flash('info', { msg: provider + ' account has been unlinked.' });
//       return res.redirect('/landing');
//     });
// };
