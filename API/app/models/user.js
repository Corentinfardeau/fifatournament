var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  username  : String,
  password  : String,
  updated_at: Date,
  created_at: Date,
}, { versionKey: false });


userSchema.pre('save', function(next) {
  var user = this;
  var now = new Date();

  // Add created at
  user.updated_at = now;
  if (!user.created_at)
    user.created_at = now;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) { return next(); }

  user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);
  next();
});

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);