require('babel/register');

// connect to database.
const dbSchema = require('../database/dbSchema.js');
const chalk = require('chalk');
const devServer = require('../build/webpack-dev-server');
const config = require('../config');
const host = config.get('webpack_host');
const port = config.get('webpack_port');
const parser = require('body-parser');
const session = require('express-session');
const utils = require('./lib/utils');




devServer.listen(port, host, function() {
  console.log(chalk.green(
    `webpack-dev-server is now running at ${host}:${port}.`
  ));
});


////////////////////////////////////////////////////////////////////////
// TODO: All of this Auth and API will need to be refactored someday  //
// to an external file so that a deployment server can use them       //
////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////
//                                                             //
//  Authentication for the server, create sessions API         //
//                                                             //
/////////////////////////////////////////////////////////////////


devServer.app.use(parser.json());

devServer.app.use(session({
	secret: "Backend if fun because I don't have to deal with react",
	cookie: {httpOnly: false}
	}));

devServer.app.post('/authentication',utils.checkUser);

devServer.app.post('/login',function(req,res){
	dbSchema.User.findOne({
		where:
			{
				userName: req.body.username,
				password: req.body.password
			}
		})
 	.then(function(results){
 		if(results){
 			utils.createSession(req,res,results);
 		}else{
 			res.send(404);
 		}
	})
});


/////////////////////////////////////////////////////////////////
//                                                             //
// Database methods API:here for now, should be refactored     //
//                                                             //
/////////////////////////////////////////////////////////////////


/*
To test the API, try this:
"Send me all users, please"
   curl -H "Content-Type: application/json" -X POST -d '{"id":"1"}' http://localhost:3000/api/allusers

"Take this POST request with JSON payload {id:1} to localhost/api/user and print me the details"
    curl -H "Content-Type: application/json" -X POST -d '{"id":"1"}' http://localhost:3000/api/findauser

"Add a new user to the database, three flavors:""
   curl -H "Content-Type: application/json" -X POST -d '{"userName":"chrisrhoton","password":"chrisrhoton","email":"chrisrhoton","firstName":"chrisrhoton","lastName":"chrisrhoton","headline":"chrisrhoton","industry":"chrisrhoton","country":"chrisrhoton","city":"chrisrhoton","zipCode":"chrisrhoton","phoneNumber":"chrisrhoton","facebookURL":"chrisrhoton","linkedInURL":"chrisrhoton","homepageURL":"chrisrhoton","blogURL":"chrisrhoton","githubURL":"chrisrhoton","behanceURL":"chrisrhoton","web1Title":"chrisrhoton","web1URL":"chrisrhoton","web2Title":"chrisrhoton","web2URL":"chrisrhoton","pictureUrl":"chrisrhoton","positions":"chrisrhoton","summary":"chrisrhoton"}'  http://localhost:3000/api/userinfo
   curl -H "Content-Type: application/json" -X POST -d '{"userName":"seconduser","password":"seconduser","email":"seconduser","firstName":"seconduser","lastName":"seconduser","headline":"seconduser","industry":"seconduser","country":"seconduser","city":"chrisrhoton","zipCode":"chrisrhoton","phoneNumber":"chrisrhoton","facebookURL":"chrisrhoton","linkedInURL":"chrisrhoton","homepageURL":"chrisrhoton","blogURL":"chrisrhoton","githubURL":"chrisrhoton","behanceURL":"chrisrhoton","web1Title":"chrisrhoton","web1URL":"chrisrhoton","web2Title":"chrisrhoton","web2URL":"chrisrhoton","pictureUrl":"chrisrhoton","positions":"chrisrhoton","summary":"chrisrhoton"}'  http://localhost:3000/api/userinfo
   curl -H "Content-Type: application/json" -X POST -d '{"userName":"thirdUser","password":"thirdUser","email":"thirdUser"}'  http://localhost:3000/api/userinfo


   curl -H "Content-Type: application/json" -X POST -d '{"userName":"chrisrhoton","theme":"cia"}'  http://localhost:3000/api/resume

*/


// Find a user
devServer.app.post('/api/findauser', function(req, res) {
  console.log("You looked for userId: " + req.body.id)
  dbSchema.User.findOne({
      where: {
        id: req.body.id
      }
    })
    .then(function(results) {
      res.send(results.dataValues);
    })
})


////Insert Query 2 : Insert resume theme into Resumes table
devServer.app.post('/api/resume', function(req, res){
  var myResume;
  var myUser = req.body.userName;
  console.log("myUser: ", myUser);
  dbSchema.Resume.create({
    theme: req.body.theme
  }).then(function(resume){
    myResume = resume;
    console.log("myUser: ", myUser);
      dbSchema.User.findOne({
        where: {
          userName: myUser
        }
      }).then(function(user){
        user.addResume(myResume);
        res.send('successfully added resume' + user.userName + myResume.theme);
        })
    })
});



// All users please
devServer.app.post('/api/allusers', function(req, res) {
  dbSchema.User.findAll()
    .then(function(results) {
      // var userList = results.map(function(user){return "id: "+ user.id + ", userName: " + user.userName});
      res.send(results);
    })
})

// Create a User
devServer.app.post('/api/userinfo', function(req, res) {
  dbSchema.User.create({
    userName: req.body.userName,
    password: req.body.password,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    headline: req.body.headline,
    industry: req.body.industry,
    country: req.body.country,
    city: req.body.city,
    zipCode: req.body.zipCode,
    phoneNumber: req.body.phoneNumber,
    facebookURL: req.body.facebookURL,
    linkedInURL: req.body.linkedInURL,
    homepageURL: req.body.homepageURL,
    blogURL: req.body.blogURL,
    githubURL: req.body.githubURL,
    behanceURL: req.body.behanceURL,
    web1Title: req.body.web1Title,
    web1URL: req.body.web1URL,
    web2Title: req.body.web2Title,
    web2URL: req.body.web2URL,
    pictureUrl: req.body.pictureUrl,
    positions: req.body.positions,
    summary: req.body.summary
  }).then(function(userinfo) {
    res.send('successfully added ', userinfo);
  });
});
