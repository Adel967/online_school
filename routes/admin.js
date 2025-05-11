const express = require('express');
const adminController = require('../controllers/admin');
const adminStudentProjectsController = require('../controllers/admin/studentProject');
const adminDashboardController = require('../controllers/admin/dashboard');
const accountController = require('../controllers/admin/account');


const router = express.Router();
const { createCourseValidation } = require('../validators/courseValidator');
const { createCouponValidation } = require('../validators/couponValidator');
const { accountValidation } = require('../validators/accountValidator');
const { registrationEditValidator } = require('../validators/registrationValidator');
const { studentProjectValidator } = require('../validators/studentProjectValidator');
const schoolController = require('../controllers/admin/school');
const { schoolValidator } = require('../validators/schoolValidator');
const { adminAccountValidation } = require('../validators/accountValidator');
const isAdmin = require('../util/isAdmin');






router.get('/',isAdmin, adminController.getAdminIndex);

router.get('/add_course',isAdmin, adminController.getAddCourse);

router.post('/add_course',isAdmin,createCourseValidation ,adminController.postAddCourse);

router.post('/course/delete' ,isAdmin,adminController.postDeleteCourse);

router.get('/course/edit/:courseId' ,isAdmin,adminController.getEditCourse);

router.post('/course/edit' ,isAdmin,adminController.postEditCourse);

router.get('/coupons' ,isAdmin,adminController.getCoupons);

router.get('/coupon/create' ,isAdmin,adminController.getCouponForm);

router.post('/coupon/create',isAdmin,createCouponValidation ,adminController.postCreateCoupon);

router.get('/coupon/edit/:couponId',isAdmin,createCouponValidation ,adminController.getEditCoupon);

router.post('/coupon/edit', isAdmin,createCouponValidation ,adminController.postEditCoupon);

router.post('/coupon/delete',isAdmin,adminController.postDeleteCoupon);

router.get('/users',isAdmin, adminController.getUsers);

router.get('/users/:userId',isAdmin, adminController.getEditUser);

router.post('/users/:userId',isAdmin,accountValidation, adminController.postEditUser);

router.get('/registrations',isAdmin, adminController.getRegistrations);

router.get('/registrations/:registrationId',isAdmin, adminController.getEditRegistration);

router.post('/registrations/:registrationId',isAdmin,registrationEditValidator, adminController.postEditRegistration);

// GET all projects
router.get('/student-projects',isAdmin, adminStudentProjectsController.getAllProjects);

// // GET form to add
router.get('/student-projects/new',isAdmin, adminStudentProjectsController.getAddProject);

// // POST create new project
router.post('/student-projects',isAdmin, studentProjectValidator, adminStudentProjectsController.postAddProject);

// // GET form to edit
router.get('/student-projects/:id/edit',isAdmin, adminStudentProjectsController.getEditProject);

// // POST update project
router.post('/student-projects/:id', isAdmin,studentProjectValidator, adminStudentProjectsController.postEditProject);

// // POST delete project
router.post('/student-projects/:id/delete', isAdmin,adminStudentProjectsController.postDeleteProject);


router.get('/school',isAdmin, schoolController.getSchoolForm);

router.post('/school',isAdmin,schoolValidator, schoolController.postSchoolForm);

router.get('/dashboard',isAdmin, adminDashboardController.getDashboard);


router.get('/account',isAdmin, accountController.getAccount);

router.post('/account',isAdmin, adminAccountValidation, accountController.postAccount);






module.exports = router;