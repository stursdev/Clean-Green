/* jshint esversion: 6 */
/* jshint node: true */


'use strict';

const passport = require('passport');
const st = require('./strategies/local.strategy');

module.exports = function(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  st.verifyClient();
  st.verifyDriver();
};
