const School = require('../../models/school');
const { schoolValidator } = require('../../validators/schoolValidator');
const { validationResult } = require('express-validator');

exports.getSchoolForm = async (req, res) => {
    let errorMsg = req.flash('error');
    let successMsg = req.flash('success');
    if (errorMsg.length === 0) {
        errorMsg = undefined;
    }
    if (successMsg.length === 0) {
        successMsg = undefined;
    }
  const school = await School.findOne();
  res.render('admin/school/schoolForm', {        title: "  تعديل معلومات المدرسة ",
    path: "school",
    school ,errorMessage:errorMsg,successMessage: successMsg});
};

exports.postSchoolForm = async (req, res) => {
  const { name, phoneNumber, email, location, facebookLink, instagramLink, tiktokLink, youtubeLink } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash('error',  errors.array()[0].msg);  
    return res.redirect('/admin/school');  
  }

  let school = await School.findOne();
  if (school) {
    await school.update({ name, phoneNumber, email, location, facebookLink, instagramLink, tiktokLink, youtubeLink });
  } else {
    await School.create({ name, phoneNumber, email, location, facebookLink, instagramLink, tiktokLink, youtubeLink });
  }
  
  req.flash('success', 'تمت العملية بنجاح');  
  res.redirect('/admin/school');
};

