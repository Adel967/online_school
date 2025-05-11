// validators/authValidator.js
const { body } = require('express-validator');

exports.loginValidation = [
  body("email")
  .notEmpty()
  .withMessage('يجب إدخال البريد الإلكتروني')
  .bail()
  .isEmail()
  .withMessage('الرجاء إدخال بريد إلكتروني صالح')
  .normalizeEmail(),
  
  body("password")
  .notEmpty()
  .withMessage("كلمة المرور مطلوبة")

    // body("phoneNumber")
    // .notEmpty()
    // .withMessage('يجب إدخال رقم الهاتف')
    // .bail() // stop if empty
    // .isMobilePhone()
    // .withMessage('يجب إدخال رقم هاتف صحيح')
    // .bail()
    // .isLength({ min: 7, max: 12 })
    // .withMessage('رقم الهاتف يجب أن يكون بين 7 و 12 رقماً'),
    // body("password").isLength({min: 5}).withMessage('كلمة السر يجب أن تكون أكثر من 5 أحرف')
];

exports.signupValidation = [
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
    .isLength({ min: 7, max: 12 })
    .withMessage('رقم الهاتف يجب أن يكون بين 7 و 12 رقماً'),

  body("birthDate")
    .notEmpty()
    .withMessage("تاريخ الميلاد مطلوب")
    .isDate()
    .withMessage("تاريخ الميلاد غير صالح"),

  body("password")
    .notEmpty()
    .withMessage("كلمة المرور مطلوبة")
    .isLength({ min: 5 })
    .withMessage("كلمة السر يجب أن تكون أكثر من 5 أحرف"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("تأكيد كلمة المرور مطلوب")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("كلمتا المرور غير متطابقتين")
];
