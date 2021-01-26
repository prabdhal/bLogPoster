const bcrypt = require('bcrypt');
const User = require('../models/userSchema');
const SecretCode = require('../models/secretCodeSchema');
const { checkAuthenticated, checkNotAuthenticated } = require('../config/auth');
const passport = require('passport');
const transporter = require('../config/email');

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
  const secretCode = new SecretCode({
    email,
    code: makeid(5),
  });

  let baseUrl = 'http://localhost:3000';
  let mailOptions = {
    from: 'automailer.email@gmail.com',
    to: `${email}`,
    subject: 'Email verification for blog website',
    text: `Click the following link to verify your email: ${baseUrl}/api/auth/verification/verify-account/${user._id}/${secretCode.code}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  const savedUser = await user.save();
  const savedCode = await secretCode.save();
  res.render('verify', { title: 'verification', user, secretCode });
});

router.get('/verify', checkAuthenticated, async (req, res) => {
  let baseUrl = 'http://localhost:3000';
  let mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Email verification for blog website',
    text: `Click the following link to verify your email: ${baseUrl}/api/auth/verification/verify-account/${user._id}/${secretCode.code}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
});

router.post('/login', checkNotAuthenticated, async (req, res, next) => {
  const { username } = req.body;
  const user = await User.findOne({ username });
  if (user.status == 'pending') {
    res.render('verify', { title: 'verification', user, secretCode });
    return;
  }

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

// delete account
router.delete('/delete/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
});

// make random id
function makeid(length) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = router;
