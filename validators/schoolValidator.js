const { body } = require('express-validator');

exports.schoolValidator = [
  body('name')
    .notEmpty().withMessage('اسم المدرسة مطلوب')
    .isLength({ max: 100 }).withMessage('أسم المدرسة يجب ان لا يتجاوز ال 100 محرف'),

  body('phoneNumber')
    .notEmpty().withMessage('رقم الهاتف مطلوب')
    .isLength({ min: 6 }).withMessage('رقم الهاتف يجب أن يكون أكثر من 6 ارقام'),

  body('email')
    .notEmpty().withMessage('البريد اللالكتروني مطلوب')
    .isEmail().withMessage('ادخل بريد الكتروني صحيح'),

  body('location')
    .notEmpty().withMessage('العنوان مطلوب'),

  body('facebookLink')
    .optional({ checkFalsy: true })
    .isURL().withMessage('Invalid Facebook link.'),

  body('instagramLink')
    .optional({ checkFalsy: true })
    .isURL().withMessage('Invalid Instagram link.'),

  body('tiktokLink')
    .optional({ checkFalsy: true })
    .isURL().withMessage('Invalid TikTok link.'),

  body('youtubeLink')
    .optional({ checkFalsy: true })
    .isURL().withMessage('Invalid YouTube link.')
];