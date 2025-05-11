require('dotenv').config();


const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const sequelize = require('./util/database');
const bcrypt = require('bcryptjs');
const flash = require('express-flash');
const requestIp = require('request-ip');
const geoip = require('geoip-lite');




const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sessionStore = new SequelizeStore({
    db: sequelize,
  });




const User = require('./models/user');
const Course = require('./models/course');
const Registration = require('./models/registration');
const StudentProject = require('./models/studentProject');
const School = require('./models/school');
const Visit = require('./models/visit');





// Import Routers
const school_router = require('./routes/school');
const auth_router = require('./routes/auth');
const admin_router = require('./routes/admin');

// Import Controllers
const errorController = require('./controllers/errors');


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret: process.env.SESSION_SECRET,resave: false, saveUninitialized: false,
    store: sessionStore,cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true
  }
}));

app.use(flash());

app.use(async (req,res,next) => {
    app.locals.isAuthenticated = req.session.isAuthenticated;
    const ip = requestIp.getClientIp(req); 
    const geo = geoip.lookup(ip); 
    req.ip = ip;
    req.geo = geo;
    const school = await School.findOne();
    app.locals.school = school || null;

    next();
});  

app.use(async (req,res,next) => {
    await Visit.create({ ip: req.ip });
    next();
});  

app.use((req, res, next) => {
    if(req.session.user){
        User.findByPk(req.session.user.id).then(
            (user) => {
                if(user) {
                    req.session.user = user;
                }
                next();
            }
        ).catch();
    } else {
        next();
    }
});

app.use(school_router);
app.use(auth_router);
app.use('/admin' ,admin_router);

app.use(errorController.get404);

Registration.belongsTo(User);
User.hasMany(Registration);

Registration.belongsTo(Course);
Course.hasMany(Registration);


const PORT = process.env.PORT || 3000;

sequelize.sync(
    {
        //alter: true
    }
)
    .then(() => User.findByPk(1))
    .then(user => {
        if (!user) {
            bcrypt.hash("123456", 12).then(
                hashedPassword => {
                    return User.create({ firstName: "admin", lastName: "admin",email:"admin@admin.com",  phoneNumber: "+201080972024", password: hashedPassword, birthDate: "2000-05-17" });
                }
            )
        }
    })
    .then(() => app.listen(PORT))
    .catch((err) => console.error('Sequelize sync error:', err));