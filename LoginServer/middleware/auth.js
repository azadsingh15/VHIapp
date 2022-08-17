const jwt = require("jsonwebtoken");
const PostModel = require("../models/Posts");
const UserModel = require("../models/Users");

exports.isAuth = async (req, res, next) => {
  //console.log(req);
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      //console.log(decode);
      const user = await UserModel.findById(decode.userId);
      const newpost = await PostModel.find({ user_id: decode.userId })
        .sort({ _id: -1 })
        .findOne();
      //console.log(newpost);
      if (!newpost) {
        console.log("NOT YET POSTED");
      }
      if (!user) {
        return res.json({ success: false, message: "unauthorized user!" });
      }

      req.user = user;
      req.newpost = newpost;
      next();
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return res.json({ success: false, message: "unauthorized access1!" });
      }
      if (error.name === "TokenExpiredError") {
        return res.json({
          success: false,
          message: "sesson expired try sign in!",
        });
      }

      res.json({ success: false, message: "Internal server error!" });
    }
  } else {
    res.json({ success: false, message: "unauthorized access2!" });
  }
};
