const { Op } = require('sequelize');
const Registration = require('../../models/registration');
const User = require('../../models/user');
const Course = require('../../models/course');
const Visit = require('../../models/visit');
const moment = require('moment');

exports.getDashboard = async (req, res) => {
  const visitCount = await Visit.count();
  const totalUsers = await User.count();

  const registeredUsers = await Registration.aggregate('userId', 'count', {
    distinct: true,
  });

  const pendingRegistrations = await Registration.count({
    where: { registrationStatus: 'pending' },
  });

  const mostRegisteredCourse = await Registration.findAll({
    attributes: ['courseId', [Registration.sequelize.fn('COUNT', 'courseId'), 'count']],
    group: ['courseId'],
    order: [[Registration.sequelize.literal('count'), 'DESC']],
    include: [{ model: Course }],
    limit: 1,
  });

  const validStatuses = ['accepted', 'awaiting_payment', 'in_progress'];
  const registrations = await Registration.findAll({
    where: {
      registrationStatus: { [Op.in]: validStatuses }
    }
  });

  // Total income
  const totalIncome = registrations.reduce((acc, reg) => acc + (reg.finalPrice || 0), 0);

  // Income grouped by week (starting from Monday)
  const incomeByWeekMap = {};

  registrations.forEach(reg => {
    const createdAt = moment(reg.createdAt);
    const weekStart = createdAt.startOf('isoWeek').format('YYYY-MM-DD');

    if (!incomeByWeekMap[weekStart]) incomeByWeekMap[weekStart] = 0;
    incomeByWeekMap[weekStart] += reg.finalPrice || 0;
  });

  const incomeByWeek = Object.entries(incomeByWeekMap)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([week, income]) => ({ week, income }));

  res.render('admin/dashboard/dashboard', {
    title: "  لوحة التحكم ",

    path: "dashboard",

    visitCount,
    totalUsers,
    registeredUsers,
    pendingRegistrations,
    mostRegisteredCourse: mostRegisteredCourse[0]?.course?.title || 'N/A',
    totalIncome,
    incomeByWeek
  });
};
