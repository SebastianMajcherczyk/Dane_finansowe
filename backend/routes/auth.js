var express = require('express');
var router = express.Router();

var authController = require('../controllers/auth.controller');
/* GET users listing. */
router.post('/login', authController.logIn);
router.post('/logout', authController.logOut);

module.exports = router;
