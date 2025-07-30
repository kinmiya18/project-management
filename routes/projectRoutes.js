const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const projectController = require('../controllers/projectController');
const { projectValidation, projectUpdateValidation } = require('../validates/project.validate');
const requestValidate = require('../middlewares/validateRequest');
const checkProjectExists = require('../middlewares/checkProjectExists');

// Routes
router.get('/', projectController.getAllProjects);
router.get('/:projectId', checkProjectExists, projectController.getProjectById);
router.post('/', projectValidation, requestValidate, projectController.createProject);
router.put('/:projectId', projectUpdateValidation, requestValidate, checkProjectExists, projectController.updateProject);
router.delete('/:projectId', checkProjectExists, projectController.deleteProject);

module.exports = router;