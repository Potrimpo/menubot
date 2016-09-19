"use strict";

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  if (!req.user) return res.redirect('/landing');
  res.render('home', {
    title: 'home'
  });
};

exports.landing = (req, res) => {
  res.render('landing', {
    title: 'landing'
  });
};