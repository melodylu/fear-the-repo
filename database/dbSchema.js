import Sequelize from 'sequelize'; // add Sequelize library for tools
import db from './dbConfig.js'; // connect to database


////////////////////////////////////////////////////////
//   Build some ORM models to talk to our database!   //
//   see 'import Sequelize' and 'import db' at top.   //
////////////////////////////////////////////////////////

export const User = db.define('User', {
  userName: Sequelize.STRING,
  password: Sequelize.STRING,
  email: Sequelize.STRING,
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  headline: Sequelize.TEXT,
  industry: Sequelize.STRING,
  country: Sequelize.STRING,
  city: Sequelize.STRING,
  zipCode: Sequelize.INTEGER,
  phoneNumber: Sequelize.INTEGER,
  facebookURL: Sequelize.STRING,
  linkedInURL: Sequelize.STRING,
  homepageURL: Sequelize.STRING,
  blogURL: Sequelize.STRING,
  githubURL: Sequelize.STRING,
  behanceURL: Sequelize.STRING,
  web1Title: Sequelize.STRING,
  web1URL: Sequelize.STRING,
  web2Title: Sequelize.STRING,
  web2URL: Sequelize.STRING,
  pictureUrl: Sequelize.STRING,
  positions: Sequelize.JSON,
  summary: Sequelize.TEXT,
});



export const Resume = db.define('Resume', {
  title: Sequelize.TEXT,
  theme: Sequelize.TEXT
});

export const Block = db.define('Block', {
 jobTitle: Sequelize.STRING,
 blockPosition: Sequelize.INTEGER,
 startDate: Sequelize.DATE,
 endDate: Sequelize.DATE
});

export const Bullet = db.define('Bullet', {
 bullet: Sequelize.STRING,
 bulletPosition: Sequelize.INTEGER,
 archived: {type : Sequelize.STRING, defaultValue: 'N'}
});

export const Employer = db.define('Employer', {
  companyName: Sequelize.STRING,
  industry: Sequelize.STRING,
  country: Sequelize.STRING,
  city: Sequelize.STRING,
  zipCode: Sequelize.INTEGER,
  phoneNumber: Sequelize.INTEGER,
  jobPostingUrl: Sequelize.STRING
});


// set up foreign keys
User.hasMany(Resume);

Block.hasMany(Bullet);

Employer.hasMany(Block);

Resume.belongsToMany(Block, {
  through: 'resume_to_block'
});
Block.belongsToMany(Resume, {
  through: 'resume_to_block'
});


// export function buildATestUser(name) {
//   console.log("buildATestUser() was called.")
//   db.sync({
//     force: true
//   }).then(function() {
//     return User.create({
//       userName: name,
//       password: name,
//       email: name + '@' + name + '.com',
//       firstName: 'Optimism Kitten',
//       lastName: 'Courage Wolf',
//       headline: '#twoboosters'
//     }).then(function(testUser) {
//       console.log('\nHere is the test user you just made! :) \nIt was created by buildATestUser() in database/dbSchema.js\n')
//       console.log(testUser.get({
//         plain: true
//       }));
//     });
//   });
//   return {
//     User: User
//   }
// }
// buildATestUser('chrisrhoton')



console.log('database/dbSchema.js was run.')
