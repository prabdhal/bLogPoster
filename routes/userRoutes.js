const bcrypt = require('bcrypt');
const User = require('../models/userSchema');
const { checkAuthenticated, checkNotAuthenticated } = require('../config/auth');
const passport = require('passport');

const router = require('express').Router();

router.get('/', checkAuthenticated, async (req, res) => {
  let errors = [];
  res.render('account', { title: 'Account', errors, user: req.user });
});

router.get('/register', checkNotAuthenticated, async (req, res) => {
  let errors = [];
  res.render('register', { title: 'Register', errors, user: req.user });
});

router.get('/login', checkNotAuthenticated, (req, res) => {
  let errors = [];
  res.render('login', { title: 'Login', errors, user: req.user });
});

router.post('/register', checkNotAuthenticated, async (req, res) => {
  const { username, email, adminCode, password, confirmPassword } = req.body;

  let errors = [];
  let admin = false;

  // validate user registration information
  if (!username || !email || !password || !confirmPassword)
    errors.push('Not all fields have been entered');
  if (username.length <= 5) errors.push('Username already exists');
  if (password.length <= 7)
    errors.push('Password must contain at least 8 characters');
  if (password.search(/[a-z]/i) < 0)
    errors.push('Password must contain at least one letter');
  if (password.search(/[0-9]/) < 0)
    errors.push('Password must contain at least one digit');
  if (password !== confirmPassword) errors.push('Passwords do not match');
  if (password === username || password === email)
    errors.push('Password can not match your username or email');
  if (adminCode === process.env.ADMIN_CODE) admin = true;

  const usernameExists = await User.findOne({ username });
  if (usernameExists)
    errors.push('Username already exists, use a different username');

  const emailExists = await User.findOne({ email });
  if (emailExists) errors.push('Email already exists, use a different email');

  // return out if there are any errors with validation
  if (errors.length > 0) {
    return res.render('register', {
      title: 'Register',
      errors,
      user: req.user,
      admin: admin,
    });
  }

  // hash passwords
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    email,
    password: hashedPassword,
    admin,
  });

  const savedUser = await user.save();
  res.redirect('/account/login');
});

router.post('/login', checkNotAuthenticated, (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/account',
    failureRedirect: '/account/login',
    failureFlash: true,
  })(req, res, next);
});

router.get('/logout', checkAuthenticated, async (req, res) => {
  req.logout();
  req.flash('success_msg', 'You have successfully logged out');
  res.redirect('/account/login');
});

module.exports = router;
