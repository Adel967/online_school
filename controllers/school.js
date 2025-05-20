const Course = require('../models/course');
const Registration = require('../models/registration');
const Coupon = require('../models/coupon');
const User = require('../models/user');
const StudentProject = require('../models/studentProject');

const { validationResult } = require('express-validator');
const { Op, fn, col, where } = require('sequelize');



exports.getIndex = async (req, res, next) => {

   let errorMsg = req.flash('error');
   if (errorMsg.length === 0) {
    errorMsg = undefined;
   }

    const countryCurrencyTranslatedMap = {
        EGP: 'ج.م',
        SYR: 'ل.س',
        USD: 'دولار'
      };
  
      const userCurrency = getUserCurrency(req);

    const studentProjects = await StudentProject.findAll();

    Course.findAll()
      .then(courses => {
        // Add currency and localized price to each course
        const localizedCourses = courses.map(course => {
          const courseData = course.toJSON();
          const parsedPrices = JSON.parse(courseData.coursePrices);
          const price = parsedPrices[userCurrency] || parsedPrices.USD;
          // console.log(courseData.coursePrices["EGP"]);  // Check if EGP value exists

          // console.log(courseData);
          // console.log(price);


          return {
            ...courseData,
            localizedPrice: price,
            currency: countryCurrencyTranslatedMap[userCurrency]
          };
        });
  
        res.render('school/index', {
          title: "الصفحة الرئيسية",
          studentProjects,
          errorMessage: errorMsg,
          path: 'index',
          courses: localizedCourses
        });
      })
      .catch(error => {
        console.error(error);
        res.status(500).send('Error loading courses');
      });
}

exports.getRegistrationForm = (req, res, next) => {
  const courseId = req.params.courseId;
  const user = req.session.user;
  

  Course.findByPk(courseId)
    .then(course => {
      if (!course) {
        return res.redirect('/');
      }
      res.render('school/course_registration', {
        title: " التسجيل",

        errorMessage: '',
        course: course,
        user: user,
        errors: [],
        path: 'registration',
        
        oldInput: {
          studentFirstName: user.firstName,
          studentLastName: user.lastName,
          studentBirthDate: user.birthDate,
          phoneNumber: user.phoneNumber,
          couponUsed: '',
          notes: '',        
        }

      });
    })
    .catch(err => {
      console.error(err);
      res.redirect('/');
    });
};


const ALIVE_STATUSES = ['pending', 'accepted', 'awaiting_payment', 'in_progress'];

exports.postRegister = async (req, res, next) => {
  const {
    studentFirstName,
    studentLastName,
    studentBirthDate,
    phoneNumber,
    couponUsed,
    notes,
    courseId
  } = req.body;
  const user = req.session.user;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    try {
      const course = await Course.findByPk(courseId);
      return res.render('school/course_registration', {
        errorMessage: errors.array()[0].msg,
        course,
        user,
        path: 'registration',
        title: "التسجيل ",

        errors: errors.array(),
        oldInput: {
          studentFirstName,
          studentLastName,
          studentBirthDate,
          phoneNumber,
          couponUsed,
          notes,
        }
      });
    } catch (err) {
      console.error(err);
      return res.redirect('/');
    }
  }

  const userCurrency = getUserCurrency(req);

  try {
    const course = await Course.findByPk(courseId);
    if (!course) return res.redirect('/');

    const courseData = course.toJSON();
    const parsedPrices = JSON.parse(courseData.coursePrices);
    const basePrice = parsedPrices[userCurrency] || parsedPrices.USD;

    let discount = 0;
    if (couponUsed) {
      const cleanedCoupon = couponUsed.trim();

      const coupon = await Coupon.findOne({
        where: where(fn('LOWER', col('code')), cleanedCoupon.toLowerCase())
      });
      console.log(coupon);
      console.log("coupon");
      if (coupon && coupon.existingStudents < coupon.maxStudents && new Date() < new Date(coupon.lastDate)) {
        discount = coupon.salePercentage;
        coupon.existingStudents += 1;
        await coupon.save();
      } else {
        return res.render('school/course_registration', {
          title: " التسجيل",

          errorMessage: "الكوبون المدخل غير صحيح",
          course,
          user,
          path: 'registration',

          errors: [],
          oldInput: {
            studentFirstName,
            studentLastName,
            studentBirthDate,
            phoneNumber,
            couponUsed,
            notes,
          }
        });
      }
    }

    const finalPrice = basePrice - (basePrice * (discount / 100));

    // 1. Check if user is already registered
    const existingRegistration = await Registration.findOne({
      where: { userId: user.id, courseId }
    });

    if (existingRegistration) {
      if (ALIVE_STATUSES.includes(existingRegistration.registrationStatus)) {
        req.flash('error', 'لقد قمت بالفعل بالتسجيل في هذا الكورس.');
        return res.redirect('/');
      } else {
        // 2. Update the existing expired registration
        existingRegistration.firstName = studentFirstName;
        existingRegistration.lastName = studentLastName;
        existingRegistration.birthDate = studentBirthDate;
        existingRegistration.phoneNumber = phoneNumber;
        existingRegistration.couponUsed = couponUsed || null;
        existingRegistration.finalPrice = finalPrice;
        existingRegistration.currency = userCurrency;
        existingRegistration.notes = notes || null;
        existingRegistration.registrationStatus = 'pending';
        existingRegistration.paidAmount = 0;
        await existingRegistration.save();
        console.log("Done");
        req.flash('success', 'تم تحديث بيانات التسجيل وإعادة التقديم.');
        return res.redirect('/');
      }
    }

    // 3. No previous registration, create new
    await Registration.create({
      userId: user.id,
      courseId,
      firstName: studentFirstName,
      lastName: studentLastName,
      birthDate: studentBirthDate,
      phoneNumber,
      couponUsed: couponUsed || null,
      finalPrice,
      currency: userCurrency,
      notes: notes || null
    });

    req.flash('success', 'تم تسجيل الطالب بنجاح');
    res.redirect('/account');

  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
};


function getUserCurrency(req) {
  const geo = req.geo;
  const country = geo?.country || 'EG';

  const countryCurrencyMap = {
    SA: 'SAR',
    EG: 'EGP',
    SY: 'SYR',
    AE: 'AED',
    US: 'USD'
  };

  return countryCurrencyMap[country] || 'USD';
}


exports.getAccount = async (req, res) => {
  const user = req.session.user;
  let errorMsg = req.flash('error');
  if (errorMsg.length === 0) {
   errorMsg = undefined;
  }
  let successMessage = req.flash('success');
  if (successMessage.length === 0) {
    successMessage = undefined;
  }

  const statusTranslations = {
    pending: 'قيد الانتظار',
    accepted: 'مقبول',
    rejected: 'مرفوض',
    canceled: 'ملغي',
    awaiting_payment: 'بانتظار الدفع',
    in_progress: 'قيد الدراسة'
  };

  try {
    let registrations = await Registration.findAll({
      where: { userId: user.id },
      include: [Course]
    });

    const translatedRegistrations = registrations.map(reg => ({
      ...reg.toJSON(),
      statusLabel: statusTranslations[reg.registrationStatus],
      formattedDate: new Date(reg.createdAt).toLocaleDateString('en')
    }));

    res.render('school/account', {
      title: " الحساب",

      errorMessage: errorMsg,
      user,
      path: 'account',

      registrations: translatedRegistrations,
      successMessage: successMessage
    });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
};


exports.postEditAccount = async (req, res) => {
  const { firstName, lastName, birthDate, phoneNumber } = req.body;
  const user = await User.findByPk(req.session.user.id);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array()[0].msg);
    return res.redirect('/account');
  }

  if (user) {
    user.firstName = firstName;
    user.lastName = lastName;
    user.birthDate = birthDate;
    user.phoneNumber = phoneNumber;
    await user.save();
    req.session.user = user; // update session
  }
  req.flash('success', 'تم تعديل المعلومات الملف الشخصي');

  res.redirect('/account');
};
