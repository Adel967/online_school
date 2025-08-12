const StudentProject = require('../../models/studentProject');
const { validationResult } = require('express-validator');

exports.getAllProjects = async (req, res) => {
  const projects = await StudentProject.findAll();
  res.render('admin/studentProjects/studentProjects', {        title: "  مشاريع الطلاب ",
    path: "studentProjects",
    projects });
};

exports.getAddProject = (req, res) => {
  res.render('admin/studentProjects/form', {        title: "  إضافة مشروع طالب ",
    path: "studentProjects", project: null, errorMessage: '' });
};

exports.postAddProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('admin/studentProjects/form', {
      title: "  إضافة مشروع طالب ",
errorMessage:  errors.array()[0].msg  ,
      path: "studentProjects",
      project: req.body,
      errors: errors.array()[0].msg    
    });
  }

  await StudentProject.create(req.body);
  res.redirect('/admin/student-projects');
};

exports.getEditProject = async (req, res) => {
  const project = await StudentProject.findByPk(req.params.id);
  if (!project) return res.redirect('/admin/student-projects');

  res.render('admin/studentProjects/form', {       title: "  تعديل مشروع طالب ",
    path: "studentProjects", project, errorMessage: '' });
};

exports.postEditProject = async (req, res) => {
  const errors = validationResult(req);
  const project = await StudentProject.findByPk(req.params.id);

  if (!errors.isEmpty()) {
    return res.render('admin/studentProjects/form', {
      title: "  تعديل مشروع طلاب ",
      errorMessage:  errors.array()[0].msg  ,
      path: "studentProjects",
      project: { ...project.dataValues, ...req.body },
      errors: errors.array()
    });
  }

  await project.update(req.body);
  res.redirect('/admin/student-projects');
};


exports.postDeleteProject = async (req, res) => {
  await StudentProject.destroy({ where: { id: req.params.id } });
  res.redirect('/admin/student-projects');
};