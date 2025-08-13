const { body } = require('express-validator');

exports.accountValidation = [
  body("firstName")
    .notEmpty()
    .withMessage((value, { req }) => req.__('validation.first_name_required'))
    .matches(/^[A-Za-z\u0600-\u06FF\s]+$/)
    .withMessage((value, { req }) => req.__('validation.first_name_letters')),

  body("lastName")
    .notEmpty()
    .withMessage((value, { req }) => req.__('validation.last_name_required'))
    .matches(/^[A-Za-z\u0600-\u06FF\s]+$/)
    .withMessage((value, { req }) => req.__('validation.last_name_letters')),

  body("email")
    .notEmpty()
    .withMessage((value, { req }) => req.__('validation.email_required'))
    .bail()
    .isEmail()
    .withMessage((value, { req }) => req.__('validation.email_invalid'))
    .normalizeEmail(),

  body("phoneNumber")
    .notEmpty()
    .withMessage((value, { req }) => req.__('validation.phone_required'))
    .bail()
    .isMobilePhone()
    .withMessage((value, { req }) => req.__('validation.phone_invalid'))
    .bail()
    .isLength({ min: 9, max: 15 })
    .withMessage((value, { req }) => req.__('validation.phone_length')),

  body("birthDate")
    .notEmpty()
    .withMessage((value, { req }) => req.__('validation.birthdate_required'))
    .isDate()
    .withMessage((value, { req }) => req.__('validation.birthdate_invalid')),
];

exports.adminAccountValidation = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage((value, { req }) => req.__('validation.admin_first_name_required')),

  body('lastName')
    .trim()
    .notEmpty()
    .withMessage((value, { req }) => req.__('validation.admin_last_name_required')),

  body('email')
    .isEmail()
    .withMessage((value, { req }) => req.__('validation.admin_email_invalid')),

  body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage((value, { req }) => req.__('validation.admin_phone_required')),

  body('currentPassword').optional({ checkFalsy: true }),

  body('newPassword')
    .optional({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage((value, { req }) => req.__('validation.admin_password_length')),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (req.body.newPassword && value !== req.body.newPassword) {
        throw new Error(req.__('validation.admin_passwords_mismatch'));
      }
      return true;
    }),
];