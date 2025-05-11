const { body } = require('express-validator');

exports.studentProjectValidator = [
  body('title').notEmpty().withMessage('Title is required.'),
  body('description').notEmpty().withMessage('Description is required.'),
  body('imageLink').optional({ checkFalsy: true }).isURL().withMessage('Image link must be a valid URL.'),
  body('videoLink').optional({ checkFalsy: true }).isURL().withMessage('Video link must be a valid URL.'),
  body('link').optional({ checkFalsy: true }).isURL().withMessage('Link must be a valid URL.')
];