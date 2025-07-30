const {body} = require('express-validator');
const envValidation = [
    body('name')
        .notEmpty().withMessage('Environment variable name is required')
        .isString().withMessage('Name must be a string')
        .trim(),
    body('value')
        .notEmpty().withMessage('Environment variable value is required')
        .isString().withMessage('Value must be a string')
        .trim()
];

const envUpdateValidation = [
    body('name')
        .optional()
        .isString().withMessage('Name must be a string')
        .trim(),
    body('value')
        .optional()
        .isString().withMessage('Value must be a string')
        .trim()
];

module.exports = {
    envValidation,
    envUpdateValidation
};