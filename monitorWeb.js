var request = require('sync-request');
var firebase = require('firebase');
// Initialize Firebase
var config = {
    apiKey: "AIzaSyACmrWGV7KPqfHVJQLbfxyTU1DIWWkg55M",
    authDomain: "page-monitor-b5405.firebaseapp.com",
    databaseURL: "https://page-monitor-b5405.firebaseio.com",
    storageBucket: "page-monitor-b5405.appspot.com",
    messagingSenderId: "923435609725"
};
firebase.initializeApp(config);

return firebase.database().ref().once('value').then(function(snapshot) {
    var allUserData = snapshot.val();
    for (var userKey in allUserData) {
        var webpages = allUserData[userKey].webpages;
        for (var webKey in webpages) {
            var webpage = webpages[webKey];
            console.log("Checking: ", webpage.pageLink);
            var response = request('GET', webpage.pageLink);
            var body = response.body.toString('utf-8');
                var webpageData = webpage;
                if (response.statusCode == 200) {
                    if (webpageData.source !== body) {
                        var date = new Date();
                        var webData = {
                            pageTitle: webpageData.pageTitle,
                            pageLink: webpageData.pageLink,
                            frequency: webpageData.frequency,
                            keywords: webpageData.keywords,
                            lastChecked: date.getDate() + "-" + (parseInt(date.getMonth())+1) + "-" + date.getFullYear(),
                            lastModified: date.getDate() + "-" + (parseInt(date.getMonth())+1) + "-" + date.getFullYear(),
                            source: body
                        };
                        var updates = {};
                        updates['/' + userKey + '/webpages' + '/' + webKey] = webData;

                        firebase.database().ref().update(updates).then(response => {
                            console.log(webpageData.pageLink + " has changed.");
                        }).catch(function(error) {
                          console.error(error);
                        });
                    } else {
                        var date = new Date();
                        var webData = {
                            pageTitle: webpageData.pageTitle,
                            pageLink: webpageData.pageLink,
                            frequency: webpageData.frequency,
                            keywords: webpageData.keywords,
                            lastChecked: date.getDate() + "-" + (parseInt(date.getMonth())+1) + "-" + date.getFullYear(),
                            lastModified: webpageData.lastModified,
                            source: webpageData.source
                        };
                        // Write the new post's data simultaneously in the posts list and the user's post list.
                        var updates = {};
                        updates['/' + userKey + '/webpages' + '/' + webKey] = webData;

                        firebase.database().ref().update(updates).then(response => {
                            console.log(webpageData.pageLink + " has not changed.");
                        }).catch(function(error) {
                          console.error(error);
                        });
                    }
                }
                else {
                  console.log(error);
                }
//            });
        }
    }
    // process.exit();
}).catch(function(error) {
    console.log("Database ref: ", error);
});
