const { validationResult } = require('express-validator');

module.exports = (req, res, next) => {
  const errors = {};
  const validation = validationResult(req) || [];
  if (!validation.isEmpty()) {
    validation.array().forEach((each) => {
      errors[each.param] = each.msg;
    });
    return res.status(400).json({ errors });
  }
  return next();
};
