const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
 email: {
   type: String,
   required: true,
   unique: true
 },
 pasword: {
   type: String,
   required: true
 },
 firstName: {
  type: String,
  required: true
 },
 lastName: {
  type: String,
  required: true
 }
});

//Pre-hook for password hashing
userSchema.pre('save', 
 async function (next) {
   const user = this;
   const hash = await bcrypt.hash(this.pasword, 10);

   this.password = hash;
   next();
 }
);

//Verifing password
userSchema.methods.isValidPassword = async function(password) {
 const user = this;
 const compare = await bcrypt.compare(password, user.password);

 return compare;

}

const UserModel = mongoose.model('users', userSchema);

module.exports = UserModel;