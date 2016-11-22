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
		var userRef = firebaseRef.child(user.uid);
		var webpageRef = userRef.child("webpages"); // getting child refrence
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

/* GET Edit Monitored page link */
router.get('/edit/:pageID', function(req, res, next) {
	var user = firebase.auth().currentUser;

	if (user) {
	  // User is signed in.
		var firebaseRef = firebase.database().ref();
		var userRef = firebaseRef.child(user.uid);
		var webpageRef = userRef.child("webpages"); // getting child refrence
		webpageRef.once("value", function(snapshot) {
			var webpages = snapshot.val();
			var webpage = webpages[Object.keys(webpages)[req.params.pageID]];
			res.render('edit-monitored-page', { title: 'Edit Monitored Page', user: user, webpage: webpage });
		});
	} else {
	  // No user is signed in.
		console.log("Please login to access dashboard.");
		res.redirect('/users/login');
	}

});

/* POST Edit Monitored page link */
router.post('/edit/:pageID', function(req, res, next) {
	var user = firebase.auth().currentUser;

	if (user) {
	  // User is signed in.
		var firebaseRef = firebase.database().ref();
		var userRef = firebaseRef.child(user.uid);
		var webpageRef = userRef.child("webpages"); // getting child refrence
		webpageRef.once("value", function(snapshot) {
			var webpages = snapshot.val();
			var webpageKey = Object.keys(webpages)[req.params.pageID];
			var updateData = {
				pageTitle: req.body.pageTitle,
				pageLink: req.body.pageLink,
				frequency: req.body.frequency,
				keywords: req.body.keywords,
			};
		  var updates = {};
		  updates[user.uid + '/' + 'webpages/' + webpageKey] = updateData;
			firebase.database().ref().update(updates);
			res.redirect('/dashboard');
		});
	} else {
	  // No user is signed in.
		console.log("Please login to access dashboard.");
		res.redirect('/users/login');
	}
});

module.exports = router;
