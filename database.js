 const url = "mongodb+srv://raj:raj@cluster0.u9egf.mongodb.net/SocialDB?retryWrites=true&w=majority";
 const mongodb =require('mongodb')
 const ObjectId = mongodb.ObjectId;
 const MongoClient = require('mongodb').MongoClient

 var db;

 // Initialize connection once
MongoClient.connect(url, function(err, client) {
  if(err) throw err;
  db = client.db('SocialDB');
  console.log("database connected");
 });

 function getDb() {
  return db
}

module.exports = {getDb}


