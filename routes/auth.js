const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const {body} = require('express-validator');
const authValidator  = require('../validators/authValidator');




router.get('/login', authController.getLogin);

router.post('/login', authValidator.loginValidation , authController.postLogin);

router.get('/signup', authController.getSignUp);

router.post('/signup', authValidator.signupValidation, authController.postSignUp);

router.get('/logout', authController.getLogout);

router.get('/reset-password', authController.getResetPasswordForm);
router.post('/reset-password', authController.postResetPasswordEmail);
 router.get('/reset-password/:token', authController.getNewPasswordForm);
router.post('/reset-password/:token', [
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
],authController.postNewPassword);


module.exports = router;