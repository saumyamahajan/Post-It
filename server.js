const express = require('express');
const app = express();
const router = express.Router();
// add router in express app
//app.use("/",router);



const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(__dirname + '/public'));                   //also working
//app.use(express.static('public'));
//app.use('/css' , express.static(__dirname +'/public/css'));      //  also working
// app.use('/public', express.static(path.resolve('./public')));
app.use('/images', express.static('images'));

const path=require('path');
// app.set('views' , __dirname + '/views');
//app.use(express.static("views"));
app.set('view engine', 'ejs')
var async = require('async');

var  db = require('./database');
const req = require('express/lib/request');
 // Start the application after the database connection is ready
//  app.listen(3000);
//  console.log("Listening on port 3000");




////////////////////////////////////////////////////////////////

//sign-in pg
app.get('/', (req, res) => {
  //res.render('/views/login.html')
  res.sendFile(path.join(__dirname+'/views/login.html'));
})

//form-login-submit
// app.post('/login', (req, res) => {
//   res.render('dashboard.ejs')
// })

//login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname+'/views/login.html'));
})


//dashboard-posts
app.get('/posts', (req, res) => {
  var id = req.query.userId
  console.log('userId : ' , id);
  res.render('posts.ejs' , {userId : id})
})

//dashboard-followers
app.get('/followers', (req, res) => {

  userId = req.query.userId
   console.log("get followers : userId : " , userId);
   db.getDb().collection('Followers').find({followerId : userId}).toArray(function(err, result){
    
      if (err) throw err;  
      console.log(result)
      //console.log("get following : result.followerId : " , result.followerId);
      // db.getDb().collection('User').findOne({userId: result.followerId}, function(err, result1){
      //   //db.getDb().collection('login').insertOne(req.body, function(err, result) {  
      //     if (err) throw err;  
      //     console.log(result1)
    
          res.render('followers.ejs',{followerObj: result})
        // })

      
   })

})

//dashboard-following
app.get('/following', (req, res) => {
 
   userId = req.query.userId
   console.log("get following : userId : " , userId);
   db.getDb().collection('Followers').find({userId : userId}).toArray(function(err, result){
    
      if (err) throw err;  
      console.log(result)
      //console.log("get following : result.followerId : " , result.followerId);
      // db.getDb().collection('User').findOne({userId: result.followerId}, function(err, result1){
      //   //db.getDb().collection('login').insertOne(req.body, function(err, result) {  
      //     if (err) throw err;  
      //     console.log(result1)
    
          res.render('following.ejs',{followingObj: result})
        // })

      
   })
});


//form submission (sign in)
app.post('/loginnnnnnnn', (req, res) => {
 
  var user = req.body.userName
  var pwd = req.body.password
 // db.getDb().collection('login').insertOne(req.body).then(result => {
   db.getDb().collection('User').findOne({userName : user , password : pwd}, function(err, result){
    //db.getDb().collection('login').insertOne(req.body, function(err, result) {  
      if (err) throw err;  
      console.log(result)

      res.render('dashboard.ejs',{ userObj: result})
    })
   
});

//registration (sign up)
app.get('/registration', (req, res) => {
       res.sendFile(path.join(__dirname+'/views/registration.html'));
     })
   

//registratioon - submit
app.post('/registration', (req, res) => {

     var email = req.body.emailId
     var result
     db.getDb().collection('User').insertOne(req.body, function(err, result1) {  
       if (err) throw err;  
       console.log('one record inserted:',result1)
       
       db.getDb().collection('User').findOne({emailId : email}, function(err, result2){
        //db.getDb().collection('login').insertOne(req.body, function(err, result) {  
          if (err) throw err;  
          console.log('fineone result:',result2)

          result = result2
          res.render('dashboard.ejs',{ userObj: result})
        })

       /////res.render('dashboard.ejs',{ userObj: result})
     })
    
 });

//posts submission
 app.post('/posts', (req, res) => {
 
  var uId = req.body.userId;
  console.log("post1 user id:", uId)
 // db.getDb().collection('login').insertOne(req.body).then(result => {
    db.getDb().collection('Posts').insertOne(req.body, function(err, result) {  
      if (err) throw err;  
      console.log(result)

      getDetail(req, res);
     // res.render('dashboard.ejs',{ userObj: result })
    })
   
});

function getDetail(req, res){

  var uId = req.body.userId;
  console.log("post2 user id:", uId)
  db.getDb().collection('User').findOne({userId : uId},function (err, result) {
    if (err) console.log(err)
    else console.log("post user result:", result)
    res.render('dashboard.ejs',{ userObj: result })
});
  
}

//profile pg
app.get('/profile', (req, res) => {
  //res.render('profile.ejs',{ postObj: null })

  var uId = req.query.userId;

  console.log('USERID:',uId);
  async.parallel([
  
    function(callback){
      // Space.findOne({ _id: id }, callback);      //uId : user's id
      db.getDb().collection('User').findOne({userId : uId},function (err, result1) {
        if (err) console.log(err)
        else console.log("user result:", result1)
        callback(null,result1)
    });
       
       //collection.find({categoryType : 1 }).sort({categoryName : 1}).exec(callback);
       
    },
    function(callback){
        //User.findOne({ user_id: userid },callback);
        //db.getDb().collection('Post').findOne({}, callback)
      
        db.getDb().collection('Posts').find({userId : uId}).toArray(function(err, result2) {
          if (err) console.log(err)
          else console.log("Result2 :", result2)
          callback(null,result2)
      });
        //db.collection.find({test: "test1"}).count();
        
    }
  ],
  function(err, results){
    //if(results[1]==null)   console.log("null reult");
    //res.json({ss:results[0],us:results[1]});
    console.log("final1:",results[0]);
    console.log("final2:",results[1]);
    //console.log(results.userObj);
    //console.log(results.postobj);
    res.render('profile.ejs',{ userObj: results[0],postObj: results[1]})
  })

})

//searching by username
app.post('/search', (req, res) => {

  var searchName = req.body.userName;
  var loginUserId = req.body.loginUserId;
  console.log("search : ", searchName)
  db.getDb().collection('User').findOne({userName : searchName},function (err, result) {
    if (err) console.log(err)
    else console.log("search :", result)
    res.render('searchUser.ejs',{ searchUserObj: result , loginUserId: loginUserId})

    /////res.render('dashboard.ejs',{ userObj: result})
  })
 
});

//follow req send
app.post('/follow', (req, res) => {

  var followerId = req.body.followerId;
  var userId = req.body.userId;
  console.log("post follow: login: ", userId)
  console.log("post follow : search : ", followerId)
  db.getDb().collection('ReqFollowers').insertOne(req.body, function(err, result) {
    if (err) console.log(err)
    else console.log("post follow :search :", result)

    db.getDb().collection('User').findOne({userId : userId},function (err, result) {
      if (err) console.log(err)
      else console.log("post folllow : Login user result:", result)
    
    res.render('dashboard.ejs',{userObj: result})
    })

  })
 
});

//activity
app.get('/activity', (req, res) => {
  var loginUserName = req.query.loginUserName
  var loginUserId = req.query.loginUserId
  console.log('get activity: loginUserName : ' , loginUserName);
  console.log('get activity: loginUserId : ' , loginUserId);
  db.getDb().collection('ReqFollowers').findOne({followerId : loginUserId},function (err, result1) {
    if (err) console.log(err)
    else console.log("get activity : Login user result:", result1)
    if (!!result1){
      //console.log("get activity result1.user : Login user result:", result1)
      db.getDb().collection('User').findOne({ userId: result1.userId},function (err, result2) {
        if (err) console.log(err)
        else console.log("get activity: requested user result:", result2)
      
        res.render('activity.ejs' , {reqFollowersObj: result1 , userObj : result2 , loginUserName:loginUserName})  
      })
    }
    // res.redirect(req.get('referer'));
  })

  
})

//activity
app.post('/activity', (req, res) => {

  var followerId = req.body.followerId;
  var userId = req.body.userId;
  console.log("post activity: login: ", userId)
  console.log("post activity: search : ", followerId)
  db.getDb().collection('Followers').insertOne(req.body, function(err, result1) {
    if (err) console.log(err)
    else console.log("post activity: result1 :", result1)

     db.getDb().collection('ReqFollowers').deleteOne({userId: userId , followerId: followerId}, function(err, delResult){

     })

    db.getDb().collection('User').findOne({userId : followerId},function (err, result2) {
      if (err) console.log(err)
      else console.log("post activity: result2 :", result2)
    
    res.render('dashboard.ejs',{userObj: result2})
    })

  })
 
});

/*
app.get('/',(req, res) => {
  connection.connect();
  var sql1 = 'SELECT * FROM investors';
  var sql2 = 'SELECT * FROM member_info?';
  connection.query(sql1, function(err, investors){
      if (err) throw err; //you should use this for error handling when in a development environment
      console.log(investors); //this should print

      connection.query(sql2, function(err, members) {
          if (err) throw err;
          console.log(members);

          res.render('your view', {investors:investors, members:members});
      });  
  });
});*/

/*var collection = db.collection('photographers');
collection.find({}).toArray(function(err,result){
    var finalResult = {};
    if(err){
        console.log("Error retrieving records");
        res.send(err);
    } else if (result.length){
        console.log("Success");
        finalResult.plist = result;
        collection.find({another query }).toArray(function(err,result){
            finalResult.anotherKey = result;
            res.render('ptlist',{
                "ptlist":finalResult
            });
        });
    }else{
        res.send('No Documents');
    }
    db.close();
});*/

//test
app.post('/login', (req, res) => {

  var user = req.body.userName
  var pwd = req.body.password

  var finalResult = {};

async.parallel([
  
  function(callback){
    // Space.findOne({ _id: id }, callback);
    db.getDb().collection('User').findOne({userName : user , password : pwd},function (err, result) {
      if (err) console.log(err)
      else console.log("user result:", result)
      callback(null,result)
  });
     
     //collection.find({categoryType : 1 }).sort({categoryName : 1}).exec(callback);
     
  },
  function(callback){
      //User.findOne({ user_id: userid },callback);
      //db.getDb().collection('Post').findOne({}, callback)
      db.getDb().collection('Posts').find().count(function (err, count) {
        if (err) console.log(err)
        else console.log("Count:", count)
        callback(null,count)
    });
      //db.collection.find({test: "test1"}).count();
      
  }
],
function(err, results){
  //if(results[1]==null)   console.log("null reult");
  //res.json({ss:results[0],us:results[1]});
  console.log("final1:",results[0]);
  console.log("final2:",results[1]);
  //console.log(results.userObj);
  //console.log(results.postobj);
  res.render('dashboard.ejs',{ userObj: results[0],postObj: results[1]})
})

});

app.listen(3000, function() {
   console.log('listening on 3000')
 });

//});