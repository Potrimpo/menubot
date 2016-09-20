"use strict";

const userRepo = require('../repositories/UserRepository');

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  return userRepo.findUserCompanies(req.user.accounts)
    .then(data => res.render('home', { title: 'home', companies: data }) );
};

exports.landing = (req, res) => {
  if (req.user && req.isAuthenticated()) return res.redirect('/');
  res.render('landing', {
    title: 'landing'
  });
};