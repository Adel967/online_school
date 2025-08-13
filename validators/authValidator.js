// validators/authValidator.js
const { body } = require('express-validator');

exports.loginValidation = [
  body("email")
    .notEmpty()
    .withMessage((value, { req }) => req.__('validation.emailRequired'))
    .bail()
    .isEmail()
    .withMessage((value, { req }) => req.__('validation.emailInvalid'))
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage((value, { req }) => req.__('validation.passwordRequired'))
];

exports.signupValidation = [
  body("firstName")
    .notEmpty()
    .withMessage((value, { req }) => req.__('validation.firstNameRequired'))
    .matches(/^[A-Za-z\u0600-\u06FF\s]+$/)
    .withMessage((value, { req }) => req.__('validation.firstNameLettersOnly')),

  body("lastName")
    .notEmpty()
    .withMessage((value, { req }) => req.__('validation.lastNameRequired'))
    .matches(/^[A-Za-z\u0600-\u06FF\s]+$/)
    .withMessage((value, { req }) => req.__('validation.lastNameLettersOnly')),

  body("email")
    .notEmpty()
    .withMessage((value, { req }) => req.__('validation.emailRequired'))
    .bail()
    .isEmail()
    .withMessage((value, { req }) => req.__('validation.emailInvalid'))
    .normalizeEmail(),

  body("phoneNumber")
    .notEmpty()
    .withMessage((value, { req }) => req.__('validation.phoneRequired'))
    .bail()
    .isMobilePhone()
    .withMessage((value, { req }) => req.__('validation.phoneInvalid'))
    .bail()
    .isLength({ min: 7, max: 12 })
    .withMessage((value, { req }) => req.__('validation.phoneLength')),

  body("birthDate")
    .notEmpty()
    .withMessage((value, { req }) => req.__('validation.birthDateRequired'))
    .isDate()
    .withMessage((value, { req }) => req.__('validation.birthDateInvalid')),

  body("password")
    .notEmpty()
    .withMessage((value, { req }) => req.__('validation.passwordRequired'))
    .isLength({ min: 5 })
    .withMessage((value, { req }) => req.__('validation.passwordMinLength')),

  body("confirmPassword")
    .notEmpty()
    .withMessage((value, { req }) => req.__('validation.confirmPasswordRequired'))
    .custom((value, { req }) => value === req.body.password)
    .withMessage((value, { req }) => req.__('validation.passwordsMismatch'))
];
