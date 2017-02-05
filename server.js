// /**
//  * Module dependencies.
//  */
var Firebase = require('firebase');
var elasticsearch = require('elasticsearch');
 
var config = {
    firebaseUrl: '*firebaseUrl*',
    elasticSearchUrl: '*elasticSearchUrl*'
}

var rootRef = require("firebase-admin");

var serviceAccount = require("*firebase-admin.json*");

rootRef.initializeApp({
  credential: rootRef.credential.cert(serviceAccount),
  databaseURL: config.firebaseUrl
});

rootRef = rootRef.database().ref();
 
var client = new elasticsearch.Client({
    host: config.elasticSearchUrl
});
 
var chatsRef = rootRef.child('chatrooms');
 
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