var express = require('express');
var firebase = require("firebase");
var router = express.Router();

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyACmrWGV7KPqfHVJQLbfxyTU1DIWWkg55M",
    authDomain: "page-monitor-b5405.firebaseapp.com",
    databaseURL: "https://page-monitor-b5405.firebaseio.com",
    storageBucket: "page-monitor-b5405.appspot.com",
    messagingSenderId: "923435609725"
  };
  firebase.initializeApp(config);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


/* GET User Login Page */
router.get('/login', function(req, res, next) {
  res.render('users/login', { title: 'Login' });
});


/* POST User Login Page */
router.post('/login', function(req, res, next) {
    var somethingGoesWrong = false;
	if (somethingGoesWrong) 
	{
	    vm = {
	    	title: 'Register',
	        input: req.body
	    };
	    delete vm.input.password;
	    return res.render('users/login', vm);
	}

	firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  // ...
	});

	var user = firebase.auth().currentUser;
	var name, email, photoUrl, uid;

	if (user != null) {
		vm = {
			title: user.fullName,
		  	email:  user.email,
		  	uid: user.uid  // The user's ID, unique to the Firebase project. Do NOT use
		                   // this value to authenticate with your backend server, if
		                   // you have one. Use User.getToken() instead.
		};
		return res.render('users/login', vm);
	}
	res.render('users/login', {title: "LoginR"});


});

/* GET User Registration Page */
router.get('/register', function(req, res, next) {
  res.render('users/register', { title: 'Register' });
});

/* POST User Registration Page */
router.post('/register', function(req, res, next) {
	var somethingGoesWrong = false;
	if (somethingGoesWrong) 
	{
		vm ={
		title: "Register",
		input: req.body
	    };
	    delete vm.input.password;
	  	return res.render('users/register', vm);
	}

	// Creating a new user
	firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  console.log(errorMessage);
	  // ...
	});

	var user = firebase.auth().currentUser;

	user.updateProfile({
	  displayName: req.body.fullName
	}).then(function() {
	  // Update successful.
	  console.log("User's full name added.");
	}, function(error) {
	  // An error happened.
	  console.log("User's full name cannot be added.");
	});

	res.redirect("/");
});

module.exports = router;
