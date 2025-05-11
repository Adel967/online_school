const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../../models/user');

exports.getAccount = async (req, res) => {
    const admin = await User.findByPk(req.session.user.id);
    res.render('admin/account/edit', {
      title: "  تعديل الحساب  ",

      path: "accounts",
    admin,
    errors: [],
    oldInput: {}
  });
};

exports.postAccount = async (req, res) => {
  const errors = validationResult(req);
  const { firstName, lastName, email, phoneNumber, currentPassword, newPassword } = req.body;
  const admin = await User.findByPk(req.session.user.id);

  if (!errors.isEmpty()) {
    return res.render('admin/account/edit', {
      title: "  تعديل الحساب ",

      path: "accounts",

      admin,
      errors: errors.array(),
      oldInput: req.body,
    });
  }

  // Update basic info
  admin.firstName = firstName;
  admin.lastName = lastName;
  admin.email = email;
  admin.phoneNumber = phoneNumber;

  // Update password if requested
  if (currentPassword && newPassword) {
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.render('admin/account/edit', {
        title: "  تعديل الحساب ",

        path: "accounts",

        admin,
        errors: [{ msg: 'Current password is incorrect' }],
        oldInput: req.body,
      });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    admin.password = hashed;
  }

  await admin.save();

  res.redirect('/admin/account');
};