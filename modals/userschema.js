const mongoose = require('mongoose');
const bcrypt= require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
     name:{
        type:String,
        require:[true,'name is required'],
     },
     email:{
        type:String,
        unique:true,
        require:[true,'email is required'],
        lowecase:true,
        validate:[validator.isEmail,'Please provide a valid email']
     },
      password:{
        type:String,
        required:[true,'Please provide a password'],
        minlength:8,
        select:false,
      },
     friends:[{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
     }]
 })

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
const User=mongoose.model('User',userSchema);
module.exports=User;
