const { body } = require('express-validator');

exports.createCourseValidation = [
  body('title')
    .notEmpty()
    .withMessage('يجب إدخال عنوان الدورة')
    .bail()
    .isLength({ min: 3 })
    .withMessage('عنوان الدورة يجب أن يكون أكثر من 3 أحرف'),

  body('description')
    .notEmpty()
    .withMessage('يجب إدخال وصف الدورة')
    .bail()
    .isLength({ min: 10 })
    .withMessage('وصف الدورة يجب أن يكون أكثر من 10 أحرف'),

  body('imageUrl')
    .notEmpty()
    .withMessage('يجب إدخال صورة الدورة')
    .bail()
    .isURL()
    .withMessage('رابط الصورة غير صالح'),

  body('sessionNumber')
    .notEmpty()
    .withMessage('يجب إدخال عدد الجلسات')
    .bail()
    .isInt({ min: 1 })
    .withMessage('عدد الجلسات يجب أن يكون رقماً صحيحاً أكبر من 0'),

  body('weeksNumber')
    .notEmpty()
    .withMessage('يجب إدخال عدد الأسابيع')
    .bail()
    .isInt({ min: 1 })
    .withMessage('عدد الأسابيع يجب أن يكون رقماً صحيحاً أكبر من 0'),

  body('studentsPerGroup')
    .notEmpty()
    .withMessage('يجب إدخال عدد الطلاب في كل مجموعة')
    .bail()
    .isInt({ min: 1 })
    .withMessage('عدد الطلاب يجب أن يكون رقماً صحيحاً أكبر من 0'),

  body('studentAgeRange')
    .notEmpty()
    .withMessage('يجب إدخال الفئة العمرية للطلاب'),

    body('priceUSD')
    .notEmpty()
    .withMessage('يجب إدخال سعر الدورة بالدولار')
    .bail()
    .isFloat({ min: 0 })
    .withMessage('السعر بالدولار يجب أن يكون رقماً أكبر أو يساوي 0'),

  body('priceEGP')
    .notEmpty()
    .withMessage('يجب إدخال سعر الدورة بالجنيه المصري')
    .bail()
    .isFloat({ min: 0 })
    .withMessage('السعر بالجنيه يجب أن يكون رقماً أكبر أو يساوي 0'),

  body('priceSYR')
    .notEmpty()
    .withMessage('يجب إدخال سعر الدورة بالليرة السورية')
    .bail()
    .isFloat({ min: 0 })
    .withMessage('السعر بالليرة يجب أن يكون رقماً أكبر أو يساوي 0'),

  body('courseSale')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('نسبة الخصم يجب أن تكون رقماً أكبر أو يساوي 0')
];
