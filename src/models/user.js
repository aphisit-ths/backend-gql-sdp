//mongoose model

import mongoose from "mongoose";
import SubjectComment from "./subject_comment"
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    require: true,
    trim: true,
  },
  isAdmin:{
    type:Boolean,
    requre:true,
    default: false, 
  },
  subject_comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubjectComment",
    },
  ],
  createdAt: { 
      type: Date, 
      require: true, 
      default: () => Date.now() },
});

userSchema.pre('remove',async function(next){
  const user = this
  await SubjectComment.deleteMany({"owner":user._id})
  next()
})  

const User = mongoose.model("User", userSchema);
export default User;
