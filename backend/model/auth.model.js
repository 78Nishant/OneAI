const mongoose =require("mongoose") ;

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  fullName: { type: String },
  createdAt: { type: Date, default: Date.now },
  history:{ type: Array, default: [] }
});

module.exports=  mongoose.model("User", UserSchema);
