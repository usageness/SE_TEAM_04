var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('admin_main', { title: 'AdminMain' });
});

router.get('/login', function(req, res, next) {
  res.render('admin_login', { title: 'QuickBoard' });
});

router.post('/login', function(req, res, next) {
  // TODO: Login logic


  res.redirect('/admin');
});

router.get('/eventad', function(req, res, next) {
  res.render('admin_eventad', { title: '' });
});

router.get('/item', function(req, res, next) {
  res.render('admin_item', { title: '' });
});

router.get('/item/:itemId', function(req, res, next) {
  var itemId = req.params.itemId;
  res.render('admin_item_detail', { ItemId: itemId });
});

router.get('/newitem', function(req, res, next) {
  var itemId = '-';

  res.render('admin_newitem', { ItemId: itemId });
});

module.exports = router;
