const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const configController = require('../controllers/configController');

// Validation rules
const configValidation = [
    body('file_name')
        .trim()
        .notEmpty()
        .withMessage('File name is required')
        .isLength({ min: 1, max: 100 })
        .withMessage('File name must be between 1 and 100 characters'),
    body('mount_point')
        .trim()
        .notEmpty()
        .withMessage('Mount point is required')
        .isLength({ min: 1, max: 200 })
        .withMessage('Mount point must be between 1 and 200 characters'),
    body('file_content')
        .optional()
        .isLength({ max: 10000 })
        .withMessage('File content cannot exceed 10000 characters')
];

const configUpdateValidation = [
    body('file_name')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('File name must be between 1 and 100 characters'),
    body('mount_point')
        .optional()
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Mount point must be between 1 and 200 characters'),
    body('file_content')
        .optional()
        .isLength({ max: 10000 })
        .withMessage('File content cannot exceed 10000 characters')
];

// Routes
router.post('/:projectId', configValidation, configController.addConfig);
router.get('/:projectId/:configId', configController.getConfig);
router.put('/:projectId/:configId', configUpdateValidation, configController.updateConfig);
router.delete('/:projectId/:configId', configController.deleteConfig);

module.exports = router;