const { body } = require('express-validator');

exports.studentProjectValidator = [
  body('title_ar').notEmpty().withMessage('Title is required.'),
  body('title_en').notEmpty().withMessage('Title is required.'),

  body('description_ar').notEmpty().withMessage('Description is required.'),
  body('description_en').notEmpty().withMessage('Description is required.'),
  body('imageLink_en').optional({ checkFalsy: true }).isURL().withMessage('Image link must be a valid URL.'),
  body('videoLink').optional({ checkFalsy: true }).isURL().withMessage('Video link must be a valid URL.'),
  body('link').optional({ checkFalsy: true }).isURL().withMessage('Link must be a valid URL.')
];