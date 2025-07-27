const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const projectController = require('../controllers/projectController');

// Validation rules
const projectValidation = [
    body('key')
        .trim()
        .notEmpty()
        .withMessage('Project key is required')
        .isLength({ min: 3, max: 20 })
        .withMessage('Project key must be between 3 and 20 characters')
        .matches(/^[a-z0-9-]+$/)
        .withMessage('Project key can only contain lowercase letters, numbers, and hyphens(-)'),
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Project name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Project name must be between 2 and 100 characters')
];

const projectUpdateValidation = [
    body('key')
        .optional()
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Project key must be between 3 and 20 characters')
        .matches(/^[A-Z0-9_]+$/)
        .withMessage('Project key can only contain uppercase letters, numbers, and underscores'),
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Project name must be between 2 and 100 characters')
];

// Routes
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', projectValidation, projectController.createProject);
router.put('/:id', projectUpdateValidation, projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

module.exports = router;