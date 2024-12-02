const { validationResult } = require('express-validator');
const { ApiError } = require('../utils/apiError');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errors.array()[0];
    throw new ApiError(400, error.msg);
  }
  next();
};

module.exports = validate;