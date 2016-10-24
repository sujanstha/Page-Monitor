var express = require('express');
var firebase = require('firebase');
var router = express.Router();

/* GET Monitor a new Page */
router.get('/', function(req, res, next) {
	var user = firebase.auth().currentUser;

	if (user) {
	  // User is signed in.
		res.render('monitor-new-page', { title: 'Add a new page to monitor', user: user });
	} else {
	  // No user is signed in.
		console.log("Please login to add a new page to monitor.");
		res.redirect('/users/login');
	}
});

/* POST Monitor a new Page */
router.get('/', function(req, res, next) {

});

module.exports = router;
