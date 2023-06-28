var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt')
var dataController = require('../controllers/data.controller')
/* GET users listing. */
router.get('/', dataController.getData);
router.get('/accReceivableSum', dataController.getAccountsReceivableSummary);
router.get('/accReceivable', dataController.getAccountsReceivable);
router.get('/newpassword', function(req,res) {
    bcrypt.genSalt(5, function(err, salt) {
        bcrypt.hash(process.env.ADMIN_password, salt, function(err, hash) {
           res.send(hash)
        });
    });


})

module.exports = router;
