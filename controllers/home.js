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
        title: 'Home',
        companies,
        accounts: unregisteredAccounts(companies, req.user.accounts)
      }));

exports.landing = (req, res) =>
  res.redirect('/login')

exports.login = (req, res) =>{
  console.log("whoosp");
  req.user && req.isAuthenticated() ?
    console.log("butts");
    res.redirect('/') :
    console.log("hello");
    res.render('login', {
      title: 'Login'
    });}

exports.orders = (req, res) =>
  db.findCompany(req.params.fbid)
    .then(company =>
        res.render('orders/orders', {
          title: 'Orders',
          fbid: req.params.fbid,
          delay: company.delay,
          compName: company.name
        }));

exports.priv = (req,res) =>
  res.render('priv', {
    title: "Privacy Policy"
  });
