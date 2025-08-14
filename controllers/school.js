const Course = require('../models/course');
const Registration = require('../models/registration');
const Coupon = require('../models/coupon');
const User = require('../models/user');
const StudentProject = require('../models/studentProject');
const nodemailer = require('nodemailer');

const { validationResult } = require('express-validator');
const { Op, fn, col, where } = require('sequelize');

exports.getIndex = async (req, res, next) => {
  let errorMsg = req.flash('error');
  if (errorMsg.length === 0) errorMsg = undefined;

  let successMessage = req.flash('success');
  if (successMessage.length === 0) successMessage = undefined;

  const countryCurrencyTranslatedMap = {
    EGP: 'ج.م',
    SYR: 'ل.س',
    USD: '$'
  };

  const userCurrency = getUserCurrency(req);
  const studentProjects = await StudentProject.findAll();

  try {
    const courses = await Course.findAll();
    const localizedCourses = courses.map(course => {
      const courseData = course.toJSON();
      const parsedPrices = JSON.parse(courseData.coursePrices);
      const price = parsedPrices[userCurrency] || parsedPrices.USD;

      return {
        ...courseData,
        localizedPrice: price,
        currency: countryCurrencyTranslatedMap[userCurrency]
      };
    });

    const coursesUnder12 = localizedCourses.filter(course => course.category === 'under_12');
    const courses12AndAbove = localizedCourses.filter(course => course.category === 'above_12');

    res.render('school/index', {
      title: req.__('title.home'),
      studentProjects,
      errorMessage: errorMsg,
      successMessage: successMessage,
      path: 'index',
      coursesUnder12,
      courses12AndAbove
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading courses');
  }
};

exports.getRegistrationForm = (req, res, next) => {
  const courseId = req.params.courseId;
  const user = req.session.user;

  Course.findByPk(courseId)
    .then(course => {
      if (!course) {
        return res.redirect('/');
      }
      res.render('school/course_registration', {
        title: req.__('title.registration'),
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
        title: req.__('title.registration'),
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
      if (coupon && coupon.existingStudents < coupon.maxStudents && new Date() < new Date(coupon.lastDate)) {
        discount = coupon.salePercentage;
        coupon.existingStudents += 1;
        await coupon.save();
      } else {
        return res.render('school/course_registration', {
          title: req.__('title.registration'),
          errorMessage: req.__('messages.invalid_coupon'),
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

    let finalPrice = basePrice;
    if (course.courseSale) {
      finalPrice = basePrice - (basePrice * (course.courseSale / 100));
    }
    finalPrice = finalPrice - (finalPrice * (discount / 100));
    finalPrice = Math.floor(finalPrice);

    const existingRegistration = await Registration.findOne({
      where: { userId: user.id, courseId }
    });

    if (existingRegistration) {
      if (ALIVE_STATUSES.includes(existingRegistration.registrationStatus)) {
        req.flash('error', req.__('messages.already_registered'));
        return res.redirect('/');
      } else {
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
        req.flash('success', req.__('messages.registration_updated'));
        return res.redirect('/');
      }
    }

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

    req.flash('success', req.__('messages.registration_success'));
    sendNotification(phoneNumber, course.title_en, studentFirstName, studentLastName);
    res.redirect('/account');

  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
};

async function sendNotification(phoneNumber, courseName, firstName, Lastname) {
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: 'info@alphacodeedu.com',
      pass: '9rqPVCXUCVJ9'
    }
  });

  await transporter.sendMail({
    from: 'Alpha Code info@alphacodeedu.com',
    to: 'adelkutait8@gmail.com',
    subject: 'Password Reset',
    html: `<div style="direction: rtl; font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; background-color: #f9f9f9;">
            <h2 style="color: #4a90e2;">قام طالب بالتسجيل بكورس</h2>
            <p>مرحبا ,</p>
            <p>في التسجيل بكورس ${courseName} قام الطالب ${firstName} ${Lastname}</p>
            <p style="text-align: center;">
               رقم الهاتف ${phoneNumber}
            </p>
           </div>`
  });
}

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
    pending: req.__('status.pending'),
    accepted: req.__('status.accepted'),
    rejected: req.__('status.rejected'),
    canceled: req.__('status.canceled'),
    awaiting_payment: req.__('status.awaiting_payment'),
    in_progress: req.__('status.in_progress')
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
      title: req.__('title.profile'),
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
    req.session.user = user;
  }
  req.flash('success', req.__('messages.profile_updated'));

  res.redirect('/account');
};


exports.postChangeLanguage = (req, res) => {
  const newLang = req.body.lang;
  res.cookie('lang', newLang, { maxAge: 900000, httpOnly: true });
  req.setLocale(newLang);

  const backURL = req.header('Referer') || '/';
  res.redirect(backURL);
};