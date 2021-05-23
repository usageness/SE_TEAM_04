var express = require('express');
var router = express.Router();

var adminRouter = require('./admin');

const {postAddress} =require("../controllers/addressController");

/* GET home page. */
router.get('/', function(req, res, next) {
  let session = req.session;
  res.render('index', {
    title: 'Express',
    session: session,
    nickname: session.nickname
  });
});

router.get('/notice', function(req, res, next) {
  let session = req.session;
  res.render('index', { title: 'Express', session: session });
});

router.get('/product', function(req, res, next) {
  let session = req.session;
  res.render('product', { title: 'Express', session: session });
});

router.get('/address', function(req, res, next) {
  let session = req.session;
  res.render('address_register', { title: 'Express', session: session });
});

router.post('/address', postAddress);

router.get('/search', function(req, res, next) {
  let session = req.session;
  res.render('search', { title: 'Express', session: session });
});

router.use('/admin', adminRouter);

module.exports = router;
