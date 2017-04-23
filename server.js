// /**
//  * Module dependencies.
//  */
var Firebase = require('firebase');
var elasticsearch = require('elasticsearch');
 
var config = {
    firebaseUrl: 'https://shopper-3a019.firebaseio.com/',
    elasticSearchUrl: 'https://site:9df3e624e3b184d9fd971bc1fa7fe5e7@ori-eu-west-1.searchly.com'
}

var rootRef = require("firebase-admin");

var serviceAccount = require("/shopper-3a019-firebase-adminsdk-nah89-e54b6c4602.json");

var port = process.env.PORT || 8000

rootRef.initializeApp({
  credential: Firebase.credential.cert(serviceAccount),
  databaseURL: config.firebaseUrl
});

rootRef = rootRef.database().ref();
 
var client = new elasticsearch.Client({
    host: config.elasticSearchUrl
});
 
var chatsRef = rootRef.child('Products');
 
chatsRef.on('child_added', upsert);
chatsRef.on('child_changed', upsert);
chatsRef.on('child_removed', remove);
 
function upsert(snapshot){
    console.log('snapshot.key: ', snapshot.key)
    
    client.index({
        index: 'firebase',
        type: 'modelType',
        id: snapshot.key,
        body: snapshot.val()
    }, function(error, response){
        if(error){
            console.log("Error indexing model : " + error);
        }
    })
 
}
 
function remove(snapshot){
    client.delete({
        index: 'firebase',
        type: 'modelType',
        id: snapshot.key
    }, function(error, response){
        if(error){
            console.log("Error deleting chatroom : " + error);
        }
    });
}

server.listen(port, function() {
    console.log("App is running on port " + port);
});