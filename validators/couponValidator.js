const { body } = require('express-validator');


exports.createCouponValidation = [
    body('code')
      .notEmpty()
      .withMessage('يجب إدخال الكود ')
      .bail()
      .isLength({ min: 3 })
      .withMessage(' الكود يجب أن يكون أكثر من 3 أحرف'),
  
    body('salePercentage')
      .notEmpty()
      .withMessage('يجب إدخال نسبة الخصم')
      .bail()
      .isInt({ min: 1 })
      .withMessage('نسبة الخصم  يجب أن يكون رقماً صحيحاً أكبر من 1'),
  
    body('maxStudents')
      .notEmpty()
      .withMessage('يجب إدخال عدد الطلاب')
      .bail()
      .isInt({ min: 1 })
      .withMessage('عدد الطلاب يجب أن يكون رقماً صحيحاً أكبر من 1'),
  
      body("lastDate")
      .notEmpty()
      .withMessage("تاريخ الإنتهاء مطلوب")
      .isDate()
      .withMessage("تاريخ الأنتهاء غير صالح"),
  ];
  