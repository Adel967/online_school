const express = require('express');
const schoolController = require('../controllers/school');
const router = express.Router();
const isAuth = require('../util/isAuth');
const registrationValidation = require('../validators/registrationValidator');
const accountValidator = require('../validators/accountValidator');

router.get('/', schoolController.getIndex);

router.get('/course/register/:courseId',isAuth,schoolController.getRegistrationForm );

router.post('/course/register',isAuth,registrationValidation.registrationValidation,schoolController.postRegister );

router.get('/account', isAuth,schoolController.getAccount);

router.post('/account/edit',isAuth,accountValidator.accountValidation , schoolController.postEditAccount);



module.exports = router;