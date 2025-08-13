const { body } = require('express-validator');

exports.registrationValidation = [
  body("studentFirstName")
    .notEmpty()
    .withMessage((value, { req }) => req.__('validation.student_first_name_required'))
    .matches(/^[A-Za-z\u0600-\u06FF\s]+$/)
    .withMessage((value, { req }) => req.__('validation.student_first_name_letters')),

  body("studentLastName")
    .notEmpty()
    .withMessage((value, { req }) => req.__('validation.student_last_name_required'))
    .matches(/^[A-Za-z\u0600-\u06FF\s]+$/)
    .withMessage((value, { req }) => req.__('validation.student_last_name_letters')),

  body("phoneNumber")
    .notEmpty()
    .withMessage((value, { req }) => req.__('validation.phone_required'))
    .bail()
    .isMobilePhone()
    .withMessage((value, { req }) => req.__('validation.phone_invalid'))
    .bail()
    .isLength({ min: 7, max: 15 })
    .withMessage((value, { req }) => req.__('validation.phone_length_registration')),

  body("studentBirthDate")
    .notEmpty()
    .withMessage((value, { req }) => req.__('validation.birthdate_required'))
    .isDate()
    .withMessage((value, { req }) => req.__('validation.birthdate_invalid')),

  body('notes')
    .isLength({ max: 200 })
    .withMessage((value, { req }) => req.__('validation.notes_length_registration')),
];


exports.registrationEditValidator = [
  body('firstName')
    .trim()
    .notEmpty().withMessage((value, { req }) => req.__('validation.first_name_required'))
    .isLength({ max: 50 }).withMessage((value, { req }) => req.__('validation.first_name_max')),

  body('lastName')
    .trim()
    .notEmpty().withMessage((value, { req }) => req.__('validation.last_name_required'))
    .isLength({ max: 50 }).withMessage((value, { req }) => req.__('validation.last_name_max')),

  body('birthDate')
    .notEmpty().withMessage((value, { req }) => req.__('validation.birthdate_required'))
    .isDate().withMessage((value, { req }) => req.__('validation.birthdate_invalid')),

  body('phoneNumber')
    .notEmpty().withMessage((value, { req }) => req.__('validation.phone_required'))
    .matches(/^[\d+() -]{6,20}$/).withMessage((value, { req }) => req.__('validation.phone_format_invalid')),

  body('registrationStatus')
    .optional()
    .isIn(['pending', 'accepted', 'rejected', 'canceled', 'awaiting_payment', 'in_progress'])
    .withMessage((value, { req }) => req.__('validation.registration_status_invalid')),

  body('paidAmount')
    .optional()
    .isFloat({ min: 0 }).withMessage((value, { req }) => req.__('validation.paid_amount_positive')),

  body('couponUsed')
    .optional()
    .isLength({ max: 50 }).withMessage((value, { req }) => req.__('validation.coupon_length')),

  body('finalPrice')
    .notEmpty().withMessage((value, { req }) => req.__('validation.final_price_required'))
    .isFloat({ min: 0 }).withMessage((value, { req }) => req.__('validation.final_price_positive')),

  body('currency')
    .notEmpty().withMessage((value, { req }) => req.__('validation.currency_required'))
    .isIn(['USD', 'EGP', 'SYR']).withMessage((value, { req }) => req.__('validation.currency_invalid')),

  body('notes')
    .optional()
    .isLength({ max: 500 }).withMessage((value, { req }) => req.__('validation.notes_length_edit')),
];
