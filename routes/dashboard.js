var express = require('express');
var firebase = require('firebase');
var router = express.Router();

// Initialize Firebase
  // var config = {
  //   apiKey: "AIzaSyACmrWGV7KPqfHVJQLbfxyTU1DIWWkg55M",
  //   authDomain: "page-monitor-b5405.firebaseapp.com",
  //   databaseURL: "https://page-monitor-b5405.firebaseio.com",
  //   storageBucket: "page-monitor-b5405.appspot.com",
  //   messagingSenderId: "923435609725"
  // };
  // firebase.initializeApp(config);


/* GET Dashboard */
router.get('/', function(req, res, next) {
	var user = firebase.auth().currentUser;

	if (user) {
	  // User is signed in.
		var firebaseRef = firebase.database().ref();
		var webpageRef = firebaseRef.child("webpage"); // getting child refrence
		webpageRef.once("value", function(snapshot) {
			var webpages = snapshot.val();
			res.render('dashboard', { title: 'Dashboard', user: user, webpages: webpages });
		});
	} else {
	  // No user is signed in.
		console.log("Please login to access dashboard.");
		res.redirect('/users/login');
	}
});

module.exports = router;
