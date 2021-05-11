var express = require('express');
var router = express.Router();

var adminRouter = require('./admin');

const {postAddress} =require("../controllers/addressController");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/notice', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/product', function(req, res, next) {
  res.render('product', { title: 'Express' });
});

router.get('/address', function(req, res, next) {
  res.render('address_register', { title: 'Express' });
});

router.post('/address', postAddress, function(req, res, next) {
  res.render('address_manage', { title: 'Express' });
});


router.use('/admin', adminRouter);

module.exports = router;
