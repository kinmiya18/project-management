const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const configController = require('../controllers/configController');
const { configValidation, configUpdateValidation } = require('../validates/config.validate');
const requestValidate = require('../middlewares/validateRequest');
const checkProjectExists = require('../middlewares/checkProjectExists');
// Routes
router.post('/:projectId', configValidation, requestValidate, checkProjectExists, configController.addConfig);
router.get('/:projectId/:configId', checkProjectExists, configController.getConfig);
router.put('/:projectId/:configId', configUpdateValidation, requestValidate, checkProjectExists, configController.updateConfig);
router.delete('/:projectId/:configId', checkProjectExists, configController.deleteConfig);

module.exports = router;