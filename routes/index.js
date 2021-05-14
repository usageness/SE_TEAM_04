var express = require('express');
var router = express.Router();

var adminRouter = require('./admin');

const {postAddress} =require("../controllers/addressController");

/* GET home page. */
router.get('/', function(req, res, next) {
  /*
  if(!req.session.login){
    req.session.login = false
    req.session.idx = -1
  }
*/
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

router.post('/address', postAddress);

router.get('/search', function(req, res, next) {
  res.render('search', { title: 'Express' });
});

router.use('/admin', adminRouter);

module.exports = router;
