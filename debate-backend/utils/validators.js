const { check } = require('express-validator');

// Validation rules for signup (✅ Removed username)
const validateSignup = [
  check('email')
    .isEmail()
    .withMessage('Please provide a valid email.'),

  check('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter.')
    .matches(/[!@#$%^&*]/)
    .withMessage('Password must contain at least one special character.'),

  check('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required.'),

  check('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required.'),

  check('consentForPublic')
    .isBoolean()
    .withMessage('Invalid consent format.')
    .custom((value) => value === true)
    .withMessage('You must agree to have your debates posted publicly.'),
];

// Validation rules for login
const validateLogin = [
  check('email')
    .isEmail()
    .withMessage('Please provide a valid email.'),

  check('password')
    .notEmpty()
    .withMessage('Password is required.'),
];

module.exports = { validateSignup, validateLogin };
