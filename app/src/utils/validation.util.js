const { body } = require('express-validator');

const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('fullName')
    .notEmpty()
    .withMessage('Tên không được để trống'),
  body('role')
    .isIn(['BUYER', 'SELLER'])
    .withMessage('Role không hợp lệ'),
  body('phone')
    .optional()
    .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)
    .withMessage('Số điện thoại không hợp lệ'),
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Mật khẩu không được để trống'),
];

module.exports = {
  registerValidation,
  loginValidation
};