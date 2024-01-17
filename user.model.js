const bcrypt = require('bcrypt');
const saltRounds = 10;

// En tu método de creación o registro de usuario
userSchema.pre('save', function(next) {
  if (this.isModified('password') || this.isNew) {
    bcrypt.hash(this.password, saltRounds, (err, hash) => {
      if (err) {
        return next(err);
      }
      this.password = hash;
      next();
    });
  } else {
    return next();
  }
});

// Método para comparar las contraseñas
userSchema.methods.comparePassword = function(password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};
