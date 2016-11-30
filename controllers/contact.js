"use strict";

exports.getContact = (req, res) =>
  res.render('contact', {
    title: 'Contact'
  });
