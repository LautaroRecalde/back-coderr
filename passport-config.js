const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/user'); 

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({ email: email }, (err, user) => {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'No user found with that email.' });
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) { return done(err); }
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect.' });
          }
        });
      });
    })
  );

  // Configuración de serialización y deserialización
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  // Configuración para la estrategia de GitHub
  passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOrCreate({ githubId: profile.id }, (err, user) => {
        return done(err, user);
      });
    }
  ));
};
