var express = require('express');
var firebase = require('firebase');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var user = firebase.auth().currentUser;

  if (user) {
    // User is signed in.
    res.render('index', { title: 'Page Monitor - Monitors WebPages for you', user: user });
  } else {
    // No user is signed in.
    res.render('index', { title: 'Page Monitor - Monitors WebPages for you'});
  }
});

module.exports = router;
