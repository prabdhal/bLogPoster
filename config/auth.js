// allows only logged in users to access a specific route
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/account/login');
}

// allows only logged out users to access a specific route
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/account');
  }

  next();
}

// allows only logged out users to access landing page
function checkNotLoggedIn(req, res, next) {
  console.log('checking if user logged in');
  if (req.isAuthenticated()) {
    console.log('user is logged in and now redirecting to (/bLogPoster/posts)');
    res.redirect('/bLogPoster/posts');
    return;
  }

  console.log('user is not logged in');
  next();
}

// allows only verified users to access specific routes
function checkValidated(req, res, next) {
  if (req.user) {
    if (!req.user.active) {
      return res.redirect('/account');
    }
  }

  next();
}

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
  checkValidated,
  checkNotLoggedIn,
};
