/* jshint esversion: 6 */
/* jshint node: true */


'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Datastore = require('@google-cloud/datastore');
const ds = Datastore({
  projectId: 'clean-and-green'
});

function getModel() {
  return require('../../datastore/model-datastore');
}

var verifyClient = function() {
passport.use('local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
function(email, password, done) {
  const queryClient = ds.createQuery('Client')
    .filter('email', '=', email)
    .filter('password', '=', password);

  ds.runQuery(queryClient).then(results => {
    const users = results[0];
    if (users[0]) {
      var user = users[0];
      done(null, user);
    } else {
      done(null, false, { message: 'Wrong Credentials' });
    }
  });
}));
};

var verifyDriver = function() {
passport.use('local2', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
function(email, password, done) {
  const queryDriver = ds.createQuery('Driver')
    .filter('email', '=', email)
    .filter('password', '=', password);

  ds.runQuery(queryDriver).then(results => {
    const users = results[0];
    if (users[0]) {
      var user = users[0];
      done(null, user);
    } else {
      done(null, false, { message: 'Wrong Credentials' });
    }
  });
}));
};

module.exports = { verifyClient, verifyDriver };
