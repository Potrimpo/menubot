"use strict";

const R = require('ramda'),
  db = require('../repositories/site/CompanyRepository');

const fbid = R.pluck('fbid');

// :: [{}] -> Promise
const companiesFromAccounts =
  R.pipe(
    fbid,
    db.findUserCompanies);

const matchUncurried = (companies, val) =>
  R.contains(val.fbid, fbid(companies));

// :: [{}] -> {} -> Bool
const matchFbid = R.curry(matchUncurried);

// :: [{}] -> [{}] -> [{}]
const unregisteredAccounts = (companies, accounts) =>
  R.reject(matchFbid(companies), accounts);

exports.index = (req, res) =>
  companiesFromAccounts(req.user.accounts)
    .then(companies =>
      res.render('home', {
        title: 'home',
        companies,
        accounts: unregisteredAccounts(companies, req.user.accounts)
      }));

exports.landing = (req, res) =>
  req.user && req.isAuthenticated() ? res.redirect('/') :
    res.render('landing', {
      title: 'landing'
    });

exports.login = (req, res) =>
  req.user && req.isAuthenticated() ?
    res.redirect('/') :
    res.render('login', {
      title: 'login'
    });

exports.orders = (req, res) =>
  res.render('orders/orders', {
    title: 'Orders',
    fbid: req.params.fbid
  });

exports.priv = (req,res) =>
  res.render('priv', {
    title: "Privacy Policy"
  });
