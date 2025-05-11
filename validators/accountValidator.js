const { body } = require('express-validator');


exports.accountValidation = [
  body("firstName")
    .notEmpty()
    .withMessage("الاسم الأول مطلوب")
    .matches(/^[A-Za-z\u0600-\u06FF\s]+$/)
    .withMessage("الاسم الأول يجب أن يحتوي على أحرف فقط"),

  body("lastName")
    .notEmpty()
    .withMessage("الاسم الأخير مطلوب")
    .matches(/^[A-Za-z\u0600-\u06FF\s]+$/)
    .withMessage("الاسم الأخير يجب أن يحتوي على أحرف فقط"),

  body("email")
    .notEmpty()
    .withMessage('يجب إدخال البريد الإلكتروني')
    .bail()
    .isEmail()
    .withMessage('الرجاء إدخال بريد إلكتروني صالح')
    .normalizeEmail(),

  body("phoneNumber")
    .notEmpty()
    .withMessage('يجب إدخال رقم الهاتف')
    .bail()
    .isMobilePhone()
    .withMessage('يجب إدخال رقم هاتف صحيح')
    .bail()
    .isLength({ min: 9, max: 15 })
    .withMessage('رقم الهاتف يجب أن يكون بين 9 و 15 رقماً'),

  body("birthDate")
    .notEmpty()
    .withMessage("تاريخ الميلاد مطلوب")
    .isDate()
    .withMessage("تاريخ الميلاد غير صالح"),

];


exports.adminAccountValidation =  [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Enter a valid email'),
  body('phoneNumber').trim().notEmpty().withMessage('Phone number is required'),
  body('currentPassword').optional({ checkFalsy: true }),
  body('newPassword')
    .optional({ checkFalsy: true })
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (req.body.newPassword && value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];
