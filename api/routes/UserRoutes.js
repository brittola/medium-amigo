const express = require('express');
const UsersController = require('../controllers/UsersController');
const Authenticator = require('../middlewares/Authenticator');
const router = express.Router();

router.post('/users', UsersController.create);
router.post('/users/auth', UsersController.auth);

module.exports = router;