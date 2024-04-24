import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "userName is required"],
      unique: [true, "userName should be unique"],
      lowercase: true,
      trim: true,
    },

    avatar: {
      type: String,
    },

    password: {
      type: String,
      required: [true, "password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.isPassword = async function (password) {
  const isPassword = await bcrypt.compare(password, this.password);
  return isPassword;
};
userSchema.methods.generateAccessToken = async function () {
  console.log(this._id, this.userName);
  const data = await jwt.sign(
    {
      _id: this._id,
      userName: this.userName,
      email: this.email,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
  return data;
};
userSchema.methods.generateRefreshToken = async function () {
  const data = jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
  return data;
};
const User = mongoose.model("User", userSchema);
export default User;
