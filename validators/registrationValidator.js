// validators/authValidator.js
const { body } = require('express-validator');

exports.registrationValidation = [
  body("studentFirstName")
    .notEmpty()
    .withMessage("الاسم الأول مطلوب")
    .matches(/^[A-Za-z\u0600-\u06FF\s]+$/)
    .withMessage("الاسم الأول يجب أن يحتوي على أحرف فقط"),

  body("studentLastName")
    .notEmpty()
    .withMessage("الاسم الأخير مطلوب")
    .matches(/^[A-Za-z\u0600-\u06FF\s]+$/)
    .withMessage("الاسم الأخير يجب أن يحتوي على أحرف فقط"),

  body("phoneNumber")
    .notEmpty()
    .withMessage('يجب إدخال رقم الهاتف')
    .bail()
    .isMobilePhone()
    .withMessage('يجب إدخال رقم هاتف صحيح')
    .bail()
    .isLength({ min: 7, max: 15 })
    .withMessage('رقم الهاتف يجب أن يكون بين 7 و 12 رقماً'),

  body("studentBirthDate")
    .notEmpty()
    .withMessage("تاريخ الميلاد مطلوب")
    .isDate()
    .withMessage("تاريخ الميلاد غير صالح"),

    // body('code')
    //   .isLength({ min: 3 })
    //   .withMessage(' الكود يجب أن يكون أكثر من 3 أحرف'),

      body('notes')
      .isLength({ max: 200 })
      .withMessage(' الملاحظة يجب أن تكون أقل من 200 حرف أحرف'),
];



exports.registrationEditValidator = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ max: 50 }).withMessage('First name must be under 50 characters'),

  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ max: 50 }).withMessage('Last name must be under 50 characters'),

  body('birthDate')
    .notEmpty().withMessage('Birth date is required')
    .isDate().withMessage('Birth date must be a valid date'),

  body('phoneNumber')
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[\d+() -]{6,20}$/).withMessage('Phone number format is invalid'),

  body('registrationStatus')
    .optional()
    .isIn(['pending', 'accepted', 'rejected', 'canceled', 'awaiting_payment', 'in_progress'])
    .withMessage('Invalid registration status'),

  body('paidAmount')
    .optional()
    .isFloat({ min: 0 }).withMessage('Paid amount must be a positive number'),

  body('couponUsed')
    .optional()
    .isLength({ max: 50 }).withMessage('Coupon code must be under 50 characters'),

  body('finalPrice')
    .notEmpty().withMessage('Final price is required')
    .isFloat({ min: 0 }).withMessage('Final price must be a positive number'),

  body('currency')
    .notEmpty().withMessage('Currency is required')
    .isIn(['USD', 'EGP', 'SYR']).withMessage('Currency must be one of USD, EGP, or SYR'),

  body('notes')
    .optional()
    .isLength({ max: 500 }).withMessage('Notes must be under 500 characters'),
];

