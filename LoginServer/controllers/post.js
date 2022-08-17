const PostModel = require("../models/Posts");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/Users");
const cloudinary = require("../helper/imageUploader");
const fs = require("fs");
exports.newpost = async (req, res, next) => {
  //         //let user_id=jwt.decode(req.headers.authorization).userId;
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = await decode.userId;

    const Newuser = await UserModel.findById(user_id);
    if (!Newuser) {
      return res.json({ success: false, message: "No User found" });
    }

    const newpost = await PostModel({
      user_id: user_id,
      display_name: req.body.display_name,
      desc: req.body.desc,
      image: "",
    });
    try {
      await newpost.save();
      res.json({ success: true, newpost });
    } catch (error) {
      res.json({ success: false, message: "Post Not saved!" });
    }
    req.newpost = newpost;
    //  next();
  } catch (error) {
    res.json({ success: false, message: "New post not created" });
  }
};
exports.uploadPost = async (req, res) => {
  const { newpost } = req;
  //console.log("in");
  console.log(newpost);
  console.log(req.file);
  if (!newpost)
    return res.status(401).json({ success: false, message: "Post not found!" });

  try {
    //console.log(req.file);
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${newpost.user_id}_post_${Date.now()}`,
      width: 500,
      height: 500,
      crop: "fill",
    });

    await PostModel.findByIdAndUpdate(newpost._id, { image: result.url });
    const postInfo = {
      user_id: newpost.user_id,
      display_name: newpost.display_name,
      desc: newpost.desc,
      image: result.url,
    };
    console.log(postInfo);
    res.status(201).json({
      success: true,
      message: "Your post pic is updated!!",
      post: postInfo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "server error, try again!!",
    });
    console.log("Error while uploading profile image", error.message);
  }
};
exports.getallposts = async (req, res) => {
  try {
    const allposts = await PostModel.find({
      user_id: req.params.user_id,
    });
    console.log(allposts);
    res.json({ success: true, allposts: allposts });
  } catch (error) {
    res.json({ success: false, message: "Something's not right,Server error" });
    console.log("Error while getting all posts", error.message);
  }
};
exports.getsinglepost = async (req, res) => {
  try {
    const post = await PostModel.findOne({ _id: req.params.post_id });
    if (!post) {
      return res.json({
        success: false,
        message: "Post not found!",
      });
    }
    res.json({ sucess: true, post: post });
  } catch (error) {
    res.json({
      success: false,
      message: "Something went wrong, server error!",
    });
    console.log("Error while getting single news", error.message);
  }
};
exports.uploadPdf = async (req, res) => {
  const { newpost } = req;
  console.log(newpost);
  console.log(req.file);
  const filename = `${newpost._id}_${req.file.originalname}`;
  fs.rename(
    `data/pdfuploads/${req.file.filename}`,
    `data/pdfuploads/${filename}`,
    () => {
      console.log("Renamed!");
    }
  );
  await PostModel.findByIdAndUpdate(newpost._id, {
    image: `http://localhost:3000/${filename}`,
  });
  const postInfo = {
    user_id: newpost.user_id,
    display_name: newpost.display_name,
    desc: newpost.desc,
    image: `http://localhost:3000/${filename}`,
  };
  console.log(postInfo);
  res.status(201).json({
    success: true,
    message: "Your post is updated!!",
    post: postInfo,
  });
};
