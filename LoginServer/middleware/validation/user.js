const { check, validationResult } = require('express-validator');

exports.validateUserSignUp = [
  check('name')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Name is required!')
    .isString()
    .withMessage('Must be a valid name!')
    .isLength({ min: 3, max: 20 })
    .withMessage('Name must be within 3 to 20 character!'),
  check('email').normalizeEmail().isEmail().withMessage('Invalid email!'),
  check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Password is empty!')
    .isLength({ min: 8, max: 20 })
    .withMessage('Password must be 3 to 20 characters long!'),
  check('gender')
    .trim()
    .not()
    .isEmpty()
    .isString()
    .withMessage('Must be a valid gender'),
    check('age')
    .not()
    .isEmpty()
    .withMessage('Age is required')
    .isNumeric()
    .withMessage('Must be a Valid age')
    .custom(age=>{
        if(age<5||age>100)
            throw new Error('Enter a age between 5 to 100');
        return true;    
    }),
    check('address')
    .trim()
    .isString()
    .withMessage('Must be a valid address')

];

exports.userVlidation = (req, res, next) => {
    const result = validationResult(req).array();
    console.log(result);
    if (!result.length) return next();
  
    const error = result[0].msg;
    res.json({ success: false, message: error });
};

exports.validateUserSignIn = [
    check('email').trim().isEmail().withMessage('email / password is required!'),
    check('password')
      .trim()
      .not()
      .isEmpty()
      .withMessage('email / password is required!'),
];
