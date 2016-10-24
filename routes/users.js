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

// Check Auth State
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log(user.email, " signed in!");
  } else {
    console.log("Not signed in!");
  }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


/* GET User Login Page */
router.get('/login', function(req, res, next) {
  // Check if there is a current user session. If any one is logged in, redirect to dashboard page.
  var user = firebase.auth().currentUser;
  if (user) {
    // User is signed in.
    return res.redirect("/dashboard");
  } else {
    // No user is signed in.
    res.render('users/login', { title: 'Login' });
  }
});


/* POST User Login Page */
router.post('/login', function(req, res, next) {
    var somethingGoesWrong = false;
    var vm = {title: 'Login'};
	if (somethingGoesWrong)
	{
	    vm = {
	    	title: 'Login',
	        input: req.body
	    };
	    delete vm.input.password;
	    return res.render('users/login', vm);
	}

	firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password).then(response => {
    /* your logic here */
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
      return res.redirect('/dashboard');
  	}
  })
.catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
    return res.render('users/login', vm);
	});
});

/* GET User Loout Page */
router.get('/logout', function(req, res, next) {
  firebase.auth().signOut().then(function() {
    res.redirect('/');
  }, function(error) {
    // An error happened.
    console.error(error);
  });
});

/* GET User Registration Page */
router.get('/register', function(req, res, next) {
  // Check if there is a current user session. If any one is logged in, redirect to dashboard page.
  var user = firebase.auth().currentUser;
  if (user) {
    // User is signed in.
    return res.redirect("/dashboard");
  } else {
    // No user is signed in.
    res.render('users/register', { title: 'Register' });
  }
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
	firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password).then(response => {
    /* your logic here */
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
  })
.catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  console.log(errorMessage);
    res.redirect("/users/login");
	  // ...
	});
});




module.exports = router;
