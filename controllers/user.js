'use strict';

const bcrypt = require('bcrypt'),
  R = require('ramda'),
  db = require('../repositories/site/UserRepository.js');

const parseCode = str =>
  str.match(/\d+/g);

const codeToObj = xs => ({
  number: xs[0],
  password: xs[1]
});

const getAndCompare = obj =>
  db.getKey(obj.number)
    .then(hash =>
      bcrypt.compare(obj.password, hash.password));

// :: String -> Promise
const parseAndCompare =
  R.pipe(
    parseCode,
    codeToObj,
    getAndCompare);

exports.validKey = (req, res, next) =>
  parseAndCompare(req.body.code)
    .then(status =>
      status ? next() : res.redirect('/landing'))
    .catch(e =>
      res.status(500).redirect('/landing'));

exports.logout = (req, res) => {
  req.logout();
  res.locals.user = null;
  return res.redirect('/landing');
};

const rounds = 12;
const insertKey = ({ key, password }) =>
  bcrypt.hash(password, rounds)
    .then(hash =>
      db.newPassword(key, hash));

exports.newCode = (req, res) =>
  insertKey(req.body)
    .then(_ => res.status(200).send("success!"))
    .catch(e => res.status(500).send(e));

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
