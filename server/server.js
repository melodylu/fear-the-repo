
/////////////////////////////////////////////////////////////////////
//   This server is here for when we need it in deployment.        //
//   please run 'npm start' instead of 'nodemon server/server.js'  //
/////////////////////////////////////////////////////////////////////


// var dbSchema = require('../database/dbSchema.js'); // set up database schema


var express = require('express');
var app = express();


 app.use(express.static(__dirname.slice(0, -6) + 'dist'));


// console.log(__dirname + '../dist')

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
 app.use(function(req,res){
 	console.log("I'm hit")
 })



  console.log('Example app listening at http://%s:%s', host, port);
});


// /*

// 'dbSchema' is a test function which:
//  * builds the Sequelize models
//  * builds/clears the database tables
//  * and builds our first and only user.

//  Try calling this function from anywhere!

// */
// dbSchema();
