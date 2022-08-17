const jwt = require("jsonwebtoken");
const UserModel = require("../models/Users");
const sharp = require("sharp");
const cloudinary = require("../helper/imageUploader");
exports.createUser = async (req, res) => {
  const { name, email, password, gender, age, dateOfBirth, address, role } =
    req.body;
  const isNewUser = await UserModel.isThisEmailInUse(email);
  if (!isNewUser)
    return res.json({
      success: false,
      message: "This email is already in use, try sign-in",
    });
  const user = await UserModel({
    name,
    email,
    password,
    gender,
    age,
    dateOfBirth,
    address,
    role,
  });
  await user.save();
  res.json({ success: true, user });
};

exports.userSignIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user)
    return res.json({
      success: false,
      message: "user not found, with the given email!",
    });

  const isMatch = await user.comparePassword(password);
  if (!isMatch)
    return res.json({
      success: false,
      message: "email / password does not match!",
    });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  let oldTokens = user.tokens || [];

  if (oldTokens.length) {
    oldTokens = oldTokens.filter((t) => {
      const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
      if (timeDiff < 86400) {
        return t;
      }
    });
  }
  await UserModel.findByIdAndUpdate(user._id, {
    tokens: [...oldTokens, { token, signedAt: Date.now().toString() }],
  });

  const userInfo = {
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar ? user.avatar : "",
    user_id: user._id,
  };

  res.json({ success: true, user: userInfo, token });
};

exports.uploadProfile = async (req, res) => {
  const { user } = req;
  if (!user)
    return res
      .status(401)
      .json({ success: false, message: "unauthorized access!" });
  console.log(req.file);
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${user._id}_profile`,
      width: 500,
      height: 500,
      crop: "fill",
    });

    await UserModel.findByIdAndUpdate(user._id, { avatar: result.url });
    const userInfo = {
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: result.url,
    };
    //console.log(userInfo,user);
    res.status(201).json({
      success: true,
      message: "Your profile pic is updated!!",
      user: userInfo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "server error, try again!!",
    });
    console.log("Error while uploading profile image", error.message);
  }
};
exports.getalldoctors = async (req, res) => {
  try {
    const alldoctors = await UserModel.find({
      role: "Doctor",
    });
    console.log(alldoctors);
    res.json({ success: true, alldoctors: alldoctors });
  } catch (error) {
    res.json({ success: false, message: "Something's not right,Server error" });
    console.log("Error while getting all posts", error.message);
  }
};
exports.signOut = async (req, res) => {
  try {
    if (req.headers && req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: "Authorization fail!" });
      }
      // console.log(req.user);
      const tokens = req.user.tokens;
      const newTokens = tokens.filter((t) => t.token !== token);
      await UserModel.findByIdAndUpdate(req.user._id, { tokens: newTokens });
      res.json({ success: true, message: "Sign out successfully!" });
    }
  } catch (error) {
    console.log(error);
  }
};
