var express = require('express');
var router = express.Router();

var contractorsController = require('../controllers/contractors.controller')
/* GET users listing. */
router.get('/', contractorsController.getContractors);

module.exports = router;
