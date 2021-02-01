const registrationValidation = (errors, user) => {
  if (!user.username || !user.email || !user.password || !user.confirmPassword)
    errors.push('Not all fields have been entered');
  if (user.username.length <= 5)
    errors.push('Username must contain at least 6 characters');
  if (user.password.length <= 7)
    errors.push('Password must contain at least 8 characters');
  if (user.password.search(/[a-z]/i) < 0)
    errors.push('Password must contain at least one letter');
  if (user.password.search(/[0-9]/) < 0)
    errors.push('Password must contain at least one digit');
  if (user.password !== user.confirmPassword)
    errors.push('Passwords do not match');
  if (user.password === user.username || user.password === user.email)
    errors.push('Password can not match your username or email');
  if (user.adminCode === process.env.ADMIN_CODE) admin = true;
  return errors;
};

const passwordResetValidation = (errors, user) => {
  if (!user.password || !user.confirmPassword)
    errors.push('Not all fields have been entered');
  if (user.password.length <= 7)
    errors.push('Password must contain at least 8 characters');
  if (user.password.search(/[a-z]/i) < 0)
    errors.push('Password must contain at least one letter');
  if (user.password.search(/[0-9]/) < 0)
    errors.push('Password must contain at least one digit');
  if (user.password !== user.confirmPassword)
    errors.push('Passwords do not match');
  if (user.password === user.username || user.password === user.email)
    errors.push('Password can not match your username or email');
  return errors;
};

module.exports = { registrationValidation, passwordResetValidation };
