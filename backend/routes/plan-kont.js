var express = require('express');
var router = express.Router();
var planController = require('../controllers/plan-kont.controller')
/* GET users listing. */
router.get('/', planController.getAccounts);

module.exports = router;
