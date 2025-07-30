const { body } = require('express-validator');

const projectValidation = [
    body('key')
        .trim()
        .notEmpty()
        .withMessage('Project key là bắt buộc')
        .isLength({ min: 3, max: 20 })
        .withMessage('Project key phải có độ dài lớn hơn 3 ký tự')
        .matches(/^[a-z0-9-]+$/)
        .withMessage('Project key chỉ có thể chứa chữ thường, số và dấu gạch ngang'),
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Project name là bắt buộc')
        .isLength({ min: 2, max: 100 })
        .withMessage('Project name phải có độ dài hơn 2 ký tự '),
    body('port_host')
        .notEmpty()
        .withMessage('Port host là bắt buộc')
        .isInt({ min: 1, max: 65535 })
        .withMessage('Port host phải là số nguyên từ 1 đến 65535')
        .custom((value) => {
            // Kiểm tra các port được bảo vệ (well-known ports)
            if (value < 1024) {
                throw new Error('Port host không nên sử dụng các port hệ thống (< 1024)');
            }
            return true;
        }),
    
    body('port_container')
        .notEmpty()
        .withMessage('Port container là bắt buộc')
        .isInt({ min: 1, max: 65535 })
        .withMessage('Port container phải là số nguyên từ 1 đến 65535')
];

const projectUpdateValidation = [
    body('key')
        .optional()
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Project key phải có độ dài hơn 3 ký tự')
        .matches(/^[a-z0-9-]+$/)
        .withMessage('Project key chỉ có thể chứa chữ thường, số và dấu gạch ngang'),
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Project name phải có độ dài hơn 2 ký tự'),
    body('port_host')
        .optional()
        .isInt({ min: 1, max: 65535 })
        .withMessage('Port host phải là số nguyên từ 1 đến 65535')
        .custom((value) => {
            if (value && value < 1024) {
                throw new Error('Port host không nên sử dụng các port hệ thống (< 1024)');
            }
            return true;
        }),
    
    body('port_container')
        .optional()
        .isInt({ min: 1, max: 65535 })
        .withMessage('Port container phải là số nguyên từ 1 đến 65535')
];

module.exports = {
    projectValidation,
    projectUpdateValidation
};