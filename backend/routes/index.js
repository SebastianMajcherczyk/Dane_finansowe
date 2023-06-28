var express = require('express');
var router = express.Router();
var planRouter = require('./plan-kont')
var dataRouter = require('./data')
var contractorsRouter = require('./contractors')
const authRouter = require('./auth')
/* GET home page. */
router.use('/plan',planRouter);
router.use('/data',dataRouter);
router.use('/contractors',contractorsRouter);
router.use('/auth',authRouter);



module.exports = router;
