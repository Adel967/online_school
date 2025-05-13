const User = require('../models/user');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { title } = require('process');

const countryCodes = [
    { code: "+20", name: "مصر" },
    { code: "+971", name: "الإمارات" },
    { code: "+973", name: "البحرين" },
    { code: "+965", name: "الكويت" },
    { code: "+968", name: "عُمان" },
    { code: "+974", name: "قطر" },
    { code: "+966", name: "السعودية" },
    { code: "+967", name: "اليمن" },
    { code: "+963", name: "سوريا" },
    { code: "+962", name: "الأردن" },
    { code: "+961", name: "لبنان" },
    { code: "+964", name: "العراق" },
    { code: "+212", name: "المغرب" },
    { code: "+213", name: "الجزائر" },
    { code: "+216", name: "تونس" },
    { code: "+218", name: "ليبيا" },
    { code: "+249", name: "السودان" },
    { code: "+252", name: "الصومال" },
    { code: "+222", name: "موريتانيا" },
    { code: "+970", name: "فلسطين" },
    { code: "+269", name: "جزر القمر" },
    { code: "+275", name: "الصحراء الغربية" }
];

exports.getLogin = (req, res, next) => {
    let errorMsg = req.flash('error');
    if (errorMsg.length === 0) {
        errorMsg = undefined;
    }
    console.log(errorMsg);

    res.render(
        'auth/login', {
            title: " تسجيل الدخول",

        errorMessage: errorMsg,
        oldInput: {
            //phoneNumber: '',
            email: '',
            password: ''
        },
        errors: [],
        countryCodes
    }
    );
}

exports.postLogin = (req, res, next) => {
    const phoneNumber = req.body.phoneNumber;
    const phoneKey = req.body.phoneKey;
    const email = req.body.email;

    const password = req.body.password;
    const errors = validationResult(req);
    console.log(errors.array());


    if (!errors.isEmpty()) {
        return res.status(422).render(
            'auth/login', {
                title: " تسجيل الدخول",

            errorMessage: errors.array()[0].msg,
            oldInput: {
                // phoneNumber: phoneNumber,
                // password: password,
                email: email,
                phoneKey: phoneKey
            },
            errors: errors.array(),
            countryCodes
        }
        );
    }

    User.findOne({ where: { email: email } })
        .then(
            user => {
                if (!user) {
                    req.flash('error', 'رقم الهاتف أو كلمة السر غير صحيحة');
                    return res.redirect('/login');
                }
                bcrypt.compare(password, user.password)
                    .then(
                        result => {
                            if (result) {
                                req.session.user = user;
                                req.session.isAuthenticated = true;
                                if(user.email === "admin@admin.com") {
                                    req.session.isAdmin = true;

                                }
                                req.session.save(() => {
                                    if(user.email === "admin@admin.com") {
                                        res.redirect('/admin');

                                    } else {
                                        res.redirect('/');

                                    }
                                });

                            } else {
                                req.flash('error', 'رقم الهاتف أو كلمة السر غير صحيحة');

                                res.redirect('/login');
                            }
                        }
                    )
                    .catch();
            }
        )
        .catch(error => console.error(error))

    //res.redirect('/');
}

exports.getSignUp = (req, res, next) => {
    let errorMsg = req.flash('error');
    if (errorMsg.length === 0) {
        errorMsg = undefined;
    }
    console.log(errorMsg);

    res.render(
        'auth/signup', {
            title: "  إنشاء حساب",

        errorMessage: errorMsg,
        oldInput: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            phoneKey: '',
            birthDate: '',
            password: '',
            confirmPassword: ''
        },
        errors: [],
        countryCodes
    }
    );
}

exports.postSignUp = (req, res, next) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const phoneKey = req.body.phoneKey;
    const birthDate = req.body.birthDate;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req);
    console.log(errors.array());

    if (!errors.isEmpty()) {
        return res.status(422).render(
            'auth/signup', {
                title: "  إنشاء حساب",

            errorMessage: errors.array()[0].msg,
            oldInput: {
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                phoneKey: phoneKey,
                birthDate: birthDate,
                password: password,
                confirmPassword: confirmPassword
            },
            errors: errors.array(),
            countryCodes
        }
        );
    }

    User.findOne({ where: { email: email } }).then(
        user => {
            if (user) {
                return res.status(422).render(
                    'auth/signup', {
                        title: "  إنشاء حساب",

                    errorMessage: "البريد الإلكتروني هذا مستعمل",
                    oldInput: {
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        phoneNumber: phoneNumber,
                        phoneKey: phoneKey,
                        birthDate: birthDate,
                        password: password,
                        confirmPassword: confirmPassword
                    },
                    errors: [],
                    countryCodes
                }
                );
            } else {
                return bcrypt.hash(password, 12).then(
                    hashedPassword => {
                        return User.create({
                            firstName: firstName,
                            lastName: lastName,
                            email: email,
                            phoneNumber: phoneKey + phoneNumber,
                            birthDate: birthDate,
                            password: hashedPassword
                        })
                    })
                    .then(user => {
                        req.session.user = user;
                        req.session.isAuthenticated = true;

                        req.session.save(() => {
                            res.redirect('/');
                        });
                    })
            }
        }
    ).catch();



}

exports.getLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
}


exports.getResetPasswordForm = (req, res) => {
    res.render('auth/reset-password-request', {title:"إعادة تعيين كلمة مرور" ,error: null, oldInput: {} });
};


exports.postResetPasswordEmail = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.render('auth/reset-password-request', {
            title:"إعادة تعيين كلمة مرور",
            error: "هذا البريد الإلكتروني غير موجود",
            oldInput: { email }
        });
    }

    const token = crypto.randomBytes(32).toString('hex');
    console.log(Date.now().toString);
    const expiration = Date.now() + 3600000; // 1 hour

    user.resetToken = token;
    user.resetTokenExpiration = new Date(expiration);
    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${token}`;

    // Email setup
    const transporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
          port: 465,
secure: true,
        //service: 'gmail',
        auth: {
        // user: 'hotreloadalkt@gmail.com',
        // pass: 'iefj kqpw ehbe xsox'
        user: 'info@alphacodeedu.com',
        pass: '9rqPVCXUCVJ9'
        },
        // tls: {
        //     rejectUnauthorized: false
        //   }
    });

    await transporter.sendMail({
        from: 'Your School info@alphacodeedu.com',
        to: user.email,
        subject: 'Password Reset',
        html: `<div style="direction: rtl; font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; background-color: #f9f9f9;">
                <h2 style="color: #4a90e2;">  إعادة تعيين كلمة المرور</h2>
                <p>مرحبا ,</p>
                <p>لقد تلقينا طلبًا لإعادة تعيين كلمة مرورك. يمكنك إعادة تعيينها بالنقر على الزر أدناه:</p>
                
                <p style="text-align: center;">
                    <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4a90e2; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
                    أعادة تعيين 
                    </a>
                </p>

                <p>إذا لم يعمل الزر، انسخ الرابط أدناه والصقه في متصفحك:</p>
                <p style="word-break: break-word;"><a href="${resetUrl}" style="color: #4a90e2;">${resetUrl}</a></p>

                <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />

                <p style="font-size: 0.9em; color: #999;">إذا لم تطلب إعادة تعيين كلمة المرور، فيمكنك تجاهل هذا البريد الإلكتروني بأمان.</p>
                </div>`
    });

    res.send('تم إرسال إرسال رابط الى البريد الإلكتوني, اذا لم يصل يرجى التحقق من قسم الرسائل الغير مرغوبة ');
};


exports.getNewPasswordForm = async (req, res) => {
    const token = req.params.token;
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiration: { [require('sequelize').Op.gt]: new Date() }
      }
    });
  
    if (!user) return res.send('Token is invalid or expired.');
  
    res.render('auth/new-password', { title: 'إعادة التعيين',userId: user.id.toString(), token, error: null });
};

exports.postNewPassword = async (req, res) => {
    const { userId, password, confirmPassword, token } = req.body;
  
    if (password !== confirmPassword) {
      return res.render('auth/new-password', {
        token,
        userId,
        error: 'Passwords do not match.'
      });
    }
  
    const user = await User.findOne({
      where: {
        id: userId,
        resetToken: token,
        resetTokenExpiration: { [require('sequelize').Op.gt]: new Date() }
      }
    });
  
    if (!user) return res.send('انتهت صلاحية الرابط');
  
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();
  
    res.send('    تم تغيير كلمة المرور بنجاح!');
  };