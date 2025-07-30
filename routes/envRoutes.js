const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const envController = require('../controllers/envController');
const checkProjectExists = require('../middlewares/checkProjectExists');
const requestValidate = require('../middlewares/validateRequest');
const { envValidation, envUpdateValidation } = require('../validates/env.validate');

// Routes
router.post('/:projectId', envValidation, requestValidate, checkProjectExists, envController.addEnv);
router.get('/:projectId/:envId', checkProjectExists, envController.getEnv);
router.put('/:projectId/:envId', envUpdateValidation, requestValidate, checkProjectExists, envController.updateEnv);
router.delete('/:projectId/:envId', checkProjectExists, envController.deleteEnv);

module.exports = router;


