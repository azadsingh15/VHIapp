const express = require("express");

const router = express.Router();
const {
  createUser,
  userSignIn,
  signOut,
  uploadProfile,
  getalldoctors,
} = require("../controllers/user");
const {
  newpost,
  uploadPost,
  getallposts,
  getsinglepost,
  uploadPdf,
} = require("../controllers/post");
const { isAuth } = require("../middleware/auth");
const {
  validateUserSignUp,
  userVlidation,
  validateUserSignIn,
} = require("../middleware/validation/user");
const UserModel = require("../models/Users");

const multer = require("multer");

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  console.log("in");
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg" ||
    file.mimetype == "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb("invalid image file!", false);
  }
};

const uploads = multer({ storage });
const uploadpdf = multer({ dest: "data/pdfuploads" });

router.post("/create-user", validateUserSignUp, userVlidation, createUser);
router.post("/sign-in", validateUserSignIn, userVlidation, userSignIn);
router.get("/sign-out", isAuth, signOut);
router.post("/create-post", isAuth, newpost);
router.post("/upload-post", isAuth, uploads.single("post"), uploadPost);
router.post("/upload-pdf", isAuth, uploadpdf.single("document"), uploadPdf);
router.post(
  "/upload-profile",
  isAuth,
  uploads.single("profile"),
  uploadProfile
);
router.get("/:user_id/allposts", isAuth, getallposts);
router.get("/:user_id/post/:post_id", isAuth, getsinglepost);
router.get("/alldoctors", isAuth, getalldoctors);

router.get("/profile", isAuth, (req, res) => {
  if (!req.user)
    return res.json({ success: false, message: "unauthorized access!" });

  res.json({
    success: true,
    profile: {
      user_id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar ? req.user.avatar : "",
      role: req.user.role,
    },
  });
});

module.exports = router;

{
  /*const express=require('express');
const jwt=require('jsonwebtoken');
const router=express.Router();
const passport=require('passport');
require('../middleware/passport');
//mongodb user model
const UserModel=require('../models/Users');

//Password handler
const bcrypt=require('bcryptjs');
const isAuth = require('../middleware/auth');

//SignUp
router.post('/signup',passport.authenticate('jwt', { session: false }),(req,res)=>{
    let {name,email,password,gender,age,dateOfBirth,address}=req.body;
    name=name.trim();
    email=email.trim();
    password=password.trim();
    gender=gender.trim();
    //age=age.trim();
    dateOfBirth=dateOfBirth.trim();
    address=address.trim();

    if(name=="" || email=="" || password=="" || gender=="" || age=="" || dateOfBirth=="" || address=="")
    {
        res.json({
            status: "FAILED",
            message:"Empty input fields!"
        });
    }else if(!/^[a-zA-Z ]*$/.test(name)){
        res.json({
            status:"FAILED",
            message:"Invalid name entered"
        })
    }else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        res.json({
            status:"FAILED",
            message:"Invalid email entered"
        })
    }else if(!new Date(dateOfBirth).getTime()){
        res.json({
            status:"FAILED",
            message: "Invalid date of birth entered"
        })
    }else if(password.length<8){
        res.json({
            status:"FAILED",
            message: "Password is too short!"
        })
    }else if(!/^[a-zA-Z ]*$/.test(gender)){
        res.json({
            status:"FAILED",
            message: "INVALID Gender entered"
        })
    }else if(!/^[a-zA-Z0-9\s,.'-]{3,}$/.test(address)){
        res.json({
            status:"FAILED",
            message: "INVALID address entered"
        })
    }else if(age<1 || age>100)
    {
        res.json({
            status:"FAILED",
            message: "INVALID Age entered"
        })
    }else{
        //Checking if user already exists
        UserModel.find({email}).then(result=>{
            if(result.length){
                //A user already exists
                res.json({
                    status:"FAILED",
                    message: "User with the provided email already exists"
                })
            }else{
                //Try to create new user
                //password handling
                const saltRounds=10;
                bcrypt.hash(password,saltRounds).then(hashedPassword=>{
                    const newUser=new User({
                        name,
                        email,
                        password: hashedPassword,
                        gender,
                        age,
                        dateOfBirth,
                        address
                    });

                    newUser.save().then(result=>{
                        res.json({
                            status:"SUCCESS",
                            message:"Signup successful",
                            data:result,
                        })
                    }).catch(err=>{
                        res.json({
                            status:"FAILED",
                            message:"An error occurred while saving user account!"
                        })
                    })
                }).catch(err=>{
                    res.json({
                        status:"FAILED",
                        message:"An error occurred while hashing password!"
                    })
                })    
            }
        }).catch(err=>{
            console.log(err);
            res.json({
                status:"FAILED",
                message:"An error occured while checking for existing user!"
            })
        })
    }
    res.send('Welcome you are in secret route');
});

//Singin
router.post('/signin',(req,res)=>{
    let {email,password}=req.body;
    email=email.trim();
    password=password.trim();

    if(email=="" || password ==""){
        res.json({
            status:"FAILED",
            message: "Empty credentials supplied"
        })
    }else{
        //Check if user exists
        UserModel.find({email})
        .then(data=>{
            if(data.length){
                //User exists
                const hashedPassword=data[0].password;
                bcrypt.compare(password,hashedPassword).then(result=>{
                    if(result){
                        //Password match
                        {/*const user = User.findOne({ email:email });

                    const token=jwt.sign({userId: user._id},process.env.JWT_SECRET,{expiresIn:'1d'});*}
                    //////////
                    passport.authenticate('local', {session: false}, (err, user, info) => {
                        if (err || !user) {
                            return res.status(400).json({
                                message: 'Something is not right',
                                user   : user
                            });
                        }
                       req.login(user, {session: false}, (err) => {
                           if (err) {
                               res.send(err);
                           }
                           // generate a signed son web token with the contents of user object and return it in the response
                           const token = jwt.sign(user, 'your_jwt_secret');
                           return res.json({user, token});
                        });
                    })(req, res);
                      ///////
                        res.json({
                            status:"SUCCESS",
                            message:"Signin successful",
                            data:data,
                            token
                        })
                    }else{
                        res.json({
                            status:"FAILED",
                            message:"Invalid password entered!"
                        })
                    }
                })
                .catch(err=>{
                    res.json({
                        status:"FAILED",
                        message:"An error occured while comparing passwords"
                    })
                })
            }else{
                res.json({
                    status:"FAILED",
                    message:"Invalid credentials entered"
                })
            }
        })
        .catch(err=>{
            res.json({
                status:"FAILED",
                message:"An error occured while checking for existing user"
            })
        })
    }
})

module.exports=router;*/
}
