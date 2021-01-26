const bcrypt = require('bcrypt');
const User = require('../models/userSchema');
const VerifyAccount = require('../models/verifyCodeSchema');
const { checkAuthenticated, checkNotAuthenticated } = require('../config/auth');
const passport = require('passport');
const transporter = require('../config/nodemailer');
const axios = require('axios');

const router = require('express').Router();

// main account page
router.get('/', checkAuthenticated, async (req, res) => {
  let errors = [];
  const user = req.user;

  res.render('account', { title: 'Account', errors, user });
});

// login page
router.get('/register', checkNotAuthenticated, async (req, res) => {
  let errors = [];
  res.render('register', { title: 'Register', errors, user: req.user });
});

// register page
router.get('/login', checkNotAuthenticated, (req, res) => {
  let errors = [];
  res.render('login', { title: 'Login', errors, user: req.user });
});

// verifies user account
router.get('/verify-account/:userId/:verifyCode', async (req, res) => {
  const user = await User.findOne({ _id: req.params.userId });

  // verification code does not exist
  const verify = await VerifyAccount.findOne({ email: user.email });
  if (!verify) {
    req.flash(
      'error_msg',
      'Your activation link is invalid, try sending a new validation code'
    );
    return res.redirect('/account');
  }

  // verification code does not match
  if (verify.code !== req.params.verifyCode) {
    req.flash(
      'error_msg',
      'Verification code does not match, try sending a new validation code'
    );

    return res.redirect('/account');
  }

  // user account active
  user.active = true;
  await user.save();
  await VerifyAccount.findOneAndDelete({ email: user.email });

  req.flash('success_msg', 'You have successfully verified your account');
  req.logIn();
  res.redirect('/account');
});

// account recovery page where user enters email to reset account
router.get('/account-recovery', (req, res) => {
  res.render('accountRecovery', { title: 'Account Recovery', user: req.user });
});

// takes user to reset password page if user verification passes
router.get('/account-recovery/:userId/:code', async (req, res) => {
  const user = await User.findOne({ _id: req.params.userId });

  // verification code does not exist
  const verify = await VerifyAccount.findOne({ email: user.email });
  if (!verify) {
    req.flash('error_msg', 'Your activation link is invalid');
    return res.redirect('/account/account-recovery');
  }

  // verification code does not match
  if (verify.code !== req.params.code) {
    req.flash('error_msg', 'Your verification code does not match');
    return res.redirect('/account/account-recovery');
  }

  req.flash('success_msg', 'You have successfully verified your account');
  res.redirect(`/account/reset-password/${user._id}/${verify.code}`);
});

// reset password page [Got to add auth]
router.get('/reset-password/:id/:code', async (req, res) => {
  const user = await User.findById(req.params.id);

  res.render('resetPassword', { title: 'Reset Password', user });
});

// registration form submittion
router.post('/register', checkNotAuthenticated, async (req, res) => {
  const { username, email, adminCode, password, confirmPassword } = req.body;

  let errors = [];
  let admin = false;

  // validate user registration information
  if (!username || !email || !password || !confirmPassword)
    errors.push('Not all fields have been entered');
  if (username.length <= 5)
    errors.push('Username must contain at least 6 characters');
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
  const verifyCode = new VerifyAccount({
    email,
    code: makeid(6),
  });

  mailVerificationCode(user, verifyCode, email);

  const savedUser = await user.save();
  const savedCode = await verifyCode.save();

  req.flash(
    'success_msg',
    'Verification code has been sent to your registered email'
  );
  res.redirect('/account/login');
});

// login form submittion
router.post('/login', checkNotAuthenticated, async (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/account',
    failureRedirect: '/account/login',
    failureFlash: true,
  })(req, res, next);
});

// resend verification code for account validation
router.post('/resend/verification-code/:id', async (req, res) => {
  const user = await User.findById(req.params.id);

  // delete old verification codes
  await VerifyAccount.deleteMany({ email: user.email });

  // create new verification code
  const verify = new VerifyAccount({
    email: user.email,
    code: makeid(6),
  });

  await verify.save();
  mailVerificationCode(user, verify, user.email);

  req.flash(
    'success_msg',
    'A new verification code has been successfully sent to your email'
  );
  res.redirect('/account');
});

// resend verification code for password reset
router.post('/account-recovery', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    req.flash('error_msg', 'An account with that email does not exist');
    return res.redirect('/account/account-recovery');
  }

  // delete old verification codes
  await VerifyAccount.deleteMany({ email: user.email });

  const verify = new VerifyAccount({
    email,
    code: makeid(6),
  });

  await verify.save();

  mailResetPassword(user, verify, email);

  req.flash('success_msg', 'Verification code has been sent to your email');
  res.redirect('/account/account-recovery');
});

// user logout
router.get('/logout', checkAuthenticated, async (req, res) => {
  req.logout();
  req.flash('success_msg', 'You have successfully logged out');
  res.redirect('/account/login');
});

// delete account
router.delete('/delete/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);

  res.redirect('/');
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

// mail verfication code for account validation
function mailVerificationCode(user, verify, email) {
  let link = `http://localhost:3000/account/verify-account/${user._id}/${verify.code}`;

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    cc: 'hello',
    subject: 'Email verification for blog website',
    text: `Click the following link to verify your email: ${link}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

// mail verfication code for password reset
function mailResetPassword(user, verify, email) {
  let link = `http://localhost:3000/account/account-recovery/${user._id}/${verify.code}`;

  const mailOptions = {
    from: process.env.EMAIL,
    to: `${email}`,
    subject: 'Email verification for blog website',
    text: ``,
    html: `<h3>Hello ${user.username}</h3><p>Your account username is ${user.username}.</p><p>To reset your password, click the following link: ${link}</p>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

router.put('/reset-password/:id', async (req, res) => {
  const { password, confirmPassword } = req.body;
  let user = await User.findById(req.params.id);

  let errors = [];

  if (!password || !confirmPassword)
    errors.push('Not all fields have been entered');
  if (password.length <= 7)
    errors.push('Password must contain at least 8 characters');
  if (password.search(/[a-z]/i) < 0)
    errors.push('Password must contain at least one letter');
  if (password.search(/[0-9]/) < 0)
    errors.push('Password must contain at least one digit');
  if (password !== confirmPassword) errors.push('Passwords do not match');
  if (password === user.username || password === user.email)
    errors.push('Password can not match your username or email');

  // return out if there are any errors with validation
  if (errors.length > 0) {
    return res.render('resetPassword', {
      title: 'Reset Password',
      errors,
      user,
    });
  }

  // hash passwords
  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;

  await user.save((err, result) => {
    if (err) {
      console.log(err);
      res.render('resetPassword', { title: 'Reset Password', user });
    } else {
      console.log('article successfully saved!' + result);
      res.redirect('/account/login');
    }
  });
});

module.exports = router;
