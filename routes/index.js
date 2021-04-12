var express = require('express');
var router = express.Router();

var adminRouter = require('./admin');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/notice', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/product', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// const app = express();
router.use('/admin', adminRouter);

module.exports = router;
