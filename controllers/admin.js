const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

const Course = require('../models/course');
const Coupon = require('../models/coupon');
const User = require('../models/user');
const Registration = require('../models/registration');



exports.getAdminIndex = (req, res, next) => {

    Course.findAll()
        .then(
            courses => {
                res.render(
                    'admin/index',
                    {
                      
                      title: " الصفحة الرئيسية ",

                        path: 'index',
                        courses: courses
                    }
                );
            }
        )
        .catch();


}

exports.getAddCourse = (req, res, next) => {
    res.render(
        'admin/add_course',
        {
          title: " إضافة كورس ",

            errorMessage: '',
            oldInput: {
                title_ar: '',
                title_en: '',
                description_ar: '',
                description_en: '',
                order: '',
                category: '',
                sessionNumber: '',
                weeksNumber: '',
                studentsPerGroup: '',
                studentAgeRange: '',
                priceUSD: '',
                priceEGP: '',
                priceSYR: '', courseSale: '',
                imageUrl: ''
            },
            path: "index",
            errors: [],
            courseId: '',
            edit: false
        }
    );
}

exports.postAddCourse = (req, res, next) => {
    const {
        title_ar,
        title_en,
        description_ar,
        description_en,
        order,
        category,
        sessionNumber,
        weeksNumber,
        studentsPerGroup,
        studentAgeRange,
        priceUSD,
        priceEGP,
        priceSYR,
        courseSale,
        imageUrl
    } = req.body;

    const errors = validationResult(req);
    console.log(errors.array());

    const coursePrices = {
        USD: parseFloat(priceUSD),
        EGP: parseFloat(priceEGP),
        SYR: parseFloat(priceSYR)
    };

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/add_course', {
          title: " إضافة كورس ",

            errorMessage: errors.array()[0].msg,
            oldInput: {
                title_ar,
                title_en,
                description_ar,
                description_en,
                order,
                category,
                sessionNumber,
                weeksNumber,
                studentsPerGroup,
                studentAgeRange,
                priceUSD,
                priceEGP,
                priceSYR,
                courseSale,
                imageUrl
            },
            path: "index",
            errors: errors.array(),
            courseId: '',
            edit: false
        });
    }

    Course.create({
        title_ar,
        title_en,
        description_ar,
        description_en,
        order,
        category,
        sessionNumber,
        weeksNumber,
        studentsPerGroup,
        studentAgeRange,
        coursePrices: JSON.stringify(coursePrices),
        courseSale: courseSale === '' ? null : parseFloat(courseSale),
        imageUrl
    })
        .then(() => {
            req.flash('success', 'تم إنشاء الدورة بنجاح');
            res.redirect('/admin');
        })
        .catch(error => {
            console.error(error);
            res.status(500).render('admin/add_course', {
              title: " إضافة كورس ",

                errorMessage: 'حدث خطأ أثناء إنشاء الدورة',
                oldInput: {
                    title_ar,
                    title_en,
                    description_ar,
                    description_en,
                    order,
                    category,
                    sessionNumber,
                    weeksNumber,
                    studentsPerGroup,
                    studentAgeRange,
                    priceUSD,
                    priceEGP,
                    priceSYR,
                    courseSale,
                    imageUrl
                },
                path: "index",

                errors: [],
                courseId: '',
                edit: false
            });
        });
};

exports.postDeleteCourse = (req, res, next) => {
    const courseId = req.body.courseId;

    Course.findByPk(courseId)
        .then(
            course => {
                return course.destroy();
            }
        ).then(
            () => {
                res.redirect('/admin');

            }
        )
        .catch();
}

exports.getEditCourse = (req, res, next) => {
    const courseId = req.params.courseId;

    Course.findByPk(courseId)
        .then(
            course => {
                const courseData = course.toJSON();
                const parsedPrices = JSON.parse(courseData.coursePrices);
                if (!course) {
                    return res.redirect('/admin');
                }
                res.render(
                    'admin/add_course',
                    {
                      title: " إضافة كورس ",

                        errorMessage: '',
                        oldInput: {
                            title_ar: course.title_ar,
                            title_en: course.title_en,
                            description_ar: course.description_ar,
                            description_en: course.description_en,
                            order: course.order,
                            category: course.category,
                            sessionNumber: course.sessionNumber,
                            weeksNumber: course.weeksNumber,
                            studentsPerGroup: course.studentsPerGroup,
                            studentAgeRange: course.studentAgeRange,
                            priceUSD: parsedPrices['USD'],
                            priceEGP: parsedPrices['EGP'],
                            priceSYR: parsedPrices['SYR'],
                            courseSale: course.courseSale,
                            imageUrl: course.imageUrl
                        },
                        path: "index",

                        errors: [],
                        courseId: courseId,
                        edit: true
                    }
                );
            }
        )
        .catch();
}

exports.postEditCourse = (req, res, next) => {
    const courseId = req.body.courseId;
    console.log("courseId");
    console.log(courseId);

    const {
        title_ar,
        title_en,
        description_ar,
        description_en,
        order,
        category,
        sessionNumber,
        weeksNumber,
        studentsPerGroup,
        studentAgeRange,
        priceUSD,
        priceEGP,
        priceSYR,
        courseSale,
        imageUrl
    } = req.body;

    const errors = validationResult(req);
    console.log(errors.array());

    const coursePrices = {
        USD: parseFloat(priceUSD),
        EGP: parseFloat(priceEGP),
        SYR: parseFloat(priceSYR)
    };

    Course.findByPk(courseId)
        .then(
            course => {
                console.log(course);
                if (!course) {
                    return res.redirect('/admin');
                }
                return course.update({
                    title_ar,
                    title_en,
                    description_ar,
                    description_en,
                    order,
                    category,
                    sessionNumber,
                    weeksNumber,
                    studentsPerGroup,
                    studentAgeRange,
                    coursePrices: JSON.stringify(coursePrices),
                    courseSale: courseSale === '' ? null : parseFloat(courseSale),
                    imageUrl
                });
            }
        )
        .then(
            () => {
              res.redirect('/admin');
        
            }
          )
        .catch();
}


exports.getCoupons = (req, res, next) => {
    Coupon.findAll()
    .then(coupons => {
      res.render('admin/coupons/coupons_page', {           title: " الكوبونات  ",
        coupons: coupons,path: "coupons" });
    })
    .catch(err => console.error(err));
}

exports.getCouponForm = (req, res, next) => {
    res.render(
        'admin/coupons/create_edit_coupon',
        {
          title: " إضافة كوبون ",

            errorMessage: '',
            oldInput: {
                couponId: '',
                code: '',
                salePercentage: '',
                maxStudents: '',
                lastDate: ''
            },
            path: "coupons",
            errors: [],
            edit: false
        }
    );
}

exports.postCreateCoupon = (req, res, next) => {
    const { code, salePercentage, maxStudents, lastDate } = req.body;
  
    const errors = validationResult(req);
    console.log(errors.array());


    if (!errors.isEmpty()) {
        return res.status(422).render(
            'admin/coupons/create_edit_coupon', {
              title: " إضافة كورس ",

            errorMessage: errors.array()[0].msg,
            oldInput: {
                couponId: '',
                code: code,
                salePercentage: salePercentage,
                maxStudents: maxStudents,
                lastDate: lastDate
            },
            path: "coupons",

            errors: errors.array(),
            edit:false
         }
        );
    }

    Coupon.create({
      code,
      salePercentage,
      maxStudents,
      lastDate
    })
      .then(() => {
        res.redirect('/admin/coupons');
      })
      .catch(err => {
        console.error(err);
        res.redirect('/admin/coupons');
      });
};


exports.getEditCoupon = (req, res, next) => {
    const couponId = req.params.couponId;

    Coupon.findByPk(couponId)
        .then(
            coupon => {
                if (!coupon) {
                    return res.redirect('/admin/coupons');
                }
                res.render(
                    'admin/coupons/create_edit_coupon',
                    {
                      title: " تعديل كورس ",

                        errorMessage: '',
                        oldInput: {
                            couponId: couponId,
                            code: coupon.code,
                            salePercentage: coupon.salePercentage,
                            maxStudents: coupon.maxStudents,
                            lastDate: coupon.lastDate
                        },
                        path: "coupons",

                        errors: [],
                        edit: true
                    }
                );
            }
        )
        .catch();
}

exports.postEditCoupon = (req, res, next) => {
    const { code, salePercentage, maxStudents, lastDate } = req.body;
    const couponId = req.body.couponId;

  
    const errors = validationResult(req);
    console.log(errors.array());


    if (!errors.isEmpty()) {
        return res.status(422).render(
            'admin/coupons/create_edit_coupon', {
              title: " تعديل كوبون ",

            errorMessage: errors.array()[0].msg,
            oldInput: {
                couponId: couponId,
                code: code,
                salePercentage: salePercentage,
                maxStudents: maxStudents,
                lastDate: lastDate
            },
            path: "coupons",

            errors: errors.array(),
            edit:true
         }
        );
    }

    Coupon.findByPk(couponId)
    .then(
        coupon => {
            if (!coupon) {
                return res.redirect('/admin/coupons');
            }
            return coupon.update({
                code,
                salePercentage,
                maxStudents,
                lastDate
              })
        }
    )
    .then(
        () => {
          res.redirect('/admin/coupons');
    
        }
      )
    .catch();
}

exports.postDeleteCoupon = (req, res, next) => {
    const couponId = req.body.couponId;

    Coupon.findByPk(couponId)
        .then(
            coupon => {
                if(!coupon) {
                    return res.redirect('/admin/coupons');
                }
                return coupon.destroy();
            }
        ).then(
            () => {
                res.redirect('/admin/coupons');
            }
        )
        .catch();
}


exports.getUsers = async (req, res) => {
    const search = req.query.search || '';
    const page = +req.query.page || 1;
    const ITEMS_PER_PAGE = 10;
  
    try {
      const { count, rows } = await User.findAndCountAll({
        where: {
          [Op.or]: [
            { email: { [Op.like]: `%${search}%` } },
            { phoneNumber: { [Op.like]: `%${search}%` } }
          ]
        },
        limit: ITEMS_PER_PAGE,
        offset: (page - 1) * ITEMS_PER_PAGE
      });
  
      res.render('admin/users/users_page', {
        title: "  المستخدمين ",

        users: rows,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < count,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(count / ITEMS_PER_PAGE),
        path: "users",

        search
      });
    } catch (err) {
      console.error(err);
      res.redirect('/');
    }
  };


  exports.getEditUser = async (req, res) => {
    const userId = req.params.userId;
    try {
      const user = await User.findByPk(userId);
      if (!user) return res.redirect('/admin/users');
  
      res.render('admin/users/edit_user', {
        title: " تعديل معلومات المستخدم ",

        user,
        errorMessage: null,
        validationErrors: [],
        path: "users",

      });
    } catch (err) {
      console.error(err);
      res.redirect('/admin/users');
    }
  };


  exports.postEditUser = async (req, res) => {
    const userId = req.params.userId;
    const { email, firstName, lastName, phoneNumber, birthDate } = req.body;
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      const user = await User.findByPk(userId);
      return res.render('admin/users/edit_user', {
        title: " تعديل معلومات المستخدم ",

        user: { ...user.toJSON(), email, firstName, lastName, phoneNumber, birthDate },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
        path: "users",

      });
    }
  
    try {
      const user = await User.findByPk(userId);
      if (!user) return res.redirect('/admin/users');
  
      user.email = email;
      user.firstName = firstName;
      user.lastName = lastName;
      user.phoneNumber = phoneNumber;
      user.birthDate = birthDate;
      await user.save();
  
      res.redirect('/admin/users');
    } catch (err) {
      console.error(err);
      res.redirect('/admin/users');
    }
  };


  exports.getRegistrations = async (req, res) => {
    const { search, course, status, page = 1 } = req.query;
    const limit = 10;
    const offset = (page - 1) * limit;
  
    const registrationWhere = {};
    const include = [];
  
    // Filter by course
    if (course) {
      registrationWhere.courseId = course;
    }
  
    // Filter by registration status
    if (status) {
      registrationWhere.registrationStatus = status;
    }
  
    // Add user filtering if search is provided
    if (search) {
      include.push({
        model: User,
        where: {
          [Op.or]: [
            { email: { [Op.like]: `%${search}%` } },
            { phoneNumber: { [Op.like]: `%${search}%` } },
            { firstName: { [Op.like]: `%${search}%` } },
            { lastName: { [Op.like]: `%${search}%` } },
          ],
        },
      });
    } else {
      include.push({ model: User });
    }
  
    include.push({ model: Course });
  
    const { rows, count } = await Registration.findAndCountAll({
      where: registrationWhere,
      limit,
      offset,
      include,
      order: [['createdAt', 'DESC']],
    });
  
    const courses = await Course.findAll();
  
    res.render('admin/registrations/registrations', {
      title: "  التسجيلات ",

      path: "registrations",

      registrations: rows,
      currentPage: +page,
      totalPages: Math.ceil(count / limit),
      courses,
      search,
      selectedCourse: course,
      selectedStatus: status, // pass status to the view
    });
  };
  

  exports.getEditRegistration = async (req, res) => {
    let errorMsg = req.flash('error');
    let successMsg = req.flash('success');
    if (errorMsg.length === 0) {
        errorMsg = undefined;
    }
    if (successMsg.length === 0) {
        successMsg = undefined;
    }
    const registration = await Registration.findByPk(req.params.registrationId, { include: Course });
    const courses = await Course.findAll();
    
    if (!registration) return res.redirect('/admin/registrations');
  
    res.render('admin/registrations/edit', {           title: "  تعديل التسجيلات ",
      path: "registrations",
      errorMessage: errorMsg,successMessage: successMsg,registration, courses });
  };

  exports.postEditRegistration = async (req, res) => {
    const { firstName, lastName, birthDate, phoneNumber, paidAmount, finalPrice, couponUsed, currency, notes, registrationStatus } = req.body;
    const registration = await Registration.findByPk(req.params.registrationId);
  
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
        req.flash('error',  errors.array()[0].msg);
      return  res.redirect('/admin/registrations/'+ req.params.registrationId);
    }
    console.log("registrationPrint");
    console.log(registration);
    if (!registration) return res.redirect('/admin/registrations');
  
    registration.firstName = firstName;
    registration.lastName = lastName;
    registration.birthDate = birthDate;
    registration.phoneNumber = phoneNumber;
    registration.paidAmount = paidAmount;
    registration.finalPrice = finalPrice;
    registration.couponUsed = couponUsed;
    registration.currency = currency;
    registration.notes = notes;
    registration.registrationStatus = registrationStatus;
  
    await registration.save();
    req.flash('success',  "تمت العملية بنجاح");
    return  res.redirect('/admin/registrations/'+ req.params.registrationId);
  };