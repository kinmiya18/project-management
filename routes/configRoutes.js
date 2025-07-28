const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const configController = require('../controllers/configController');

// Validation rules
const configValidation = [
    body('file_name')
        .trim()
        .notEmpty()
        .withMessage('File name là bắt buộc')
        .isLength({ min: 1, max: 100 })
        .withMessage('File name phải có độ dài từ 1 đến 100 ký tự'),
    body('mount_point')
        .trim()
        .notEmpty()
        .withMessage('Mount point là bắt buộc')
        .isLength({ min: 1, max: 200 })
        .withMessage('Mount point phải có độ dài từ 1 đến 200 ký tự'),
    body('file_content')
        .optional()
        .isLength({ max: 10000 })
        .withMessage('File content không được vượt quá 10000 ký tự')
];

const configUpdateValidation = [
    body('file_name')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('File name phải có độ dài từ 1 đến 100 ký tự'),
    body('mount_point')
        .optional()
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Mount point phải có độ dài từ 1 đến 200 ký tự'),
    body('file_content')
        .optional()
        .isLength({ max: 10000 })
        .withMessage('File content không được vượt quá 10000 ký tự')
];

// Routes
router.post('/:projectId', configValidation, configController.addConfig);
router.get('/:projectId/:configId', configController.getConfig);
router.put('/:projectId/:configId', configUpdateValidation, configController.updateConfig);
router.delete('/:projectId/:configId', configController.deleteConfig);

module.exports = router;