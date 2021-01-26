require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const passport = require('passport');

const blogRoutes = require('./routes/blogRoutes');
const userRoutes = require('./routes/userRoutes');
require('./config/passport')(passport);

// Connect to database
mongoose.connect(
  process.env.MONGODB_URI,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  console.log('Connection to Mongo DB established')
);

// Listen to port
const port = process.env.PORT || 3000;
app.listen(port, console.log(`Listening to port ${port}`));

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(morgan('dev')); // helps with console logging http requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride('_method'));
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.get('/', (req, res) => {
  res.redirect('/blogs');
});
app.use('/blogs', blogRoutes);
app.use('/account', userRoutes);
