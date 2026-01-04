import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * @type {mongoose.SchemaDefinition}
 */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    age: {
      type: Number,
      required: true,
      min: 1,
      max: 120,
    },

    password: {
      type: String,
      minlength: 8,
      required: [true, "Password is required.."],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

/* this pre is a middleware in database which will run just befor saving data and database and we are encryipting the password using bcryptjs and we use next() to move for another middleware. */

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = bcrypt.hash(this.password, 10);
  next();
});

/* now we can also create methods in mongodb  using methods.methodsname  , we can use it like methods find update create, here isPasswordCorrect is a methods for checking password */

userSchema.methods.isPasswordCorrect = async function (password) {
  if (!password) return;
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
 return jwt.sign(
    {
      _id: this._id,
      email: this.emil,
      name: this.name,
      age: this.age,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};


userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id, 
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};




const User = mongoose.model("User", userSchema);

export default User;
