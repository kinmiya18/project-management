const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const projectController = require('../controllers/projectController');

// Validation rules
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
        .withMessage('Project name phải có độ dài hơn 2 ký tự ')
];

const projectUpdateValidation = [
    body('key')
        .optional()
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Project key phải có độ dài hơn 3 ký tự')
        .matches(/^[A-Z0-9_]+$/)
        .withMessage('Project key chỉ có thể chứa chữ hoa, số và dấu gạch dưới'),
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Project name phải có độ dài hơn 2 ký tự')
];

// Routes
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', projectValidation, projectController.createProject);
router.put('/:id', projectUpdateValidation, projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

module.exports = router;