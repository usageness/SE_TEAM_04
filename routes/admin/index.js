var express = require('express');
var router = express.Router();
var db =  require ('../../models')

router.get('/', function(req, res, next) {
  res.render('admin_main', { title: 'AdminMain' });
});

router.get('/login', function(req, res, next) {
  res.render('admin_login', { title: 'QuickBoard' });
});

router.post('/login', async function(req, res, next) {
  // TODO: Login logic
  var result = false;

  const user = await db.User.findOne({
    where: {
      userid: req.body.email,
      password: req.body.password
    },
    attributes: ['id', 'nickname', 'userid'],
  });
  if(user) result = true;

  if(result){
    res.redirect('/admin', {title: '', data: user});
  }else{
    res.send('400');
  }
});

router.get('/eventad', function(req, res, next) {
  res.render('admin_eventad_detail', { title: '' });
});

router.get('/item', function(req, res, next) {
  res.render('admin_item', { title: '' });
});

router.route('/item/:itemId')
.get(function(req, res, next) {
  console.log('/item/:itemId get')

  var itemId = req.params.itemId;
  res.render('admin_item_detail', { ItemId: itemId });
})
.put(function(req, res, next) {
  var itemId = req.params.itemId;
  console.log(req.body)
  var result = false;

  if(result){
    res.send('200');
  }else{
    res.send('400');
  }
})
.delete(function(req, res, next) {
  var itemId = req.params.itemId;

  var result = false;

  if(result){
    res.send('200');
  }else{
    res.send('400');
  }
});

router.route('/item/new')
.get(function(req, res, next) {
  var itemId = '-';

  res.render('admin_newitem', { ItemId: itemId });
})
.post(function(req, res, next) {
  var itemId = '-';
  
  res.render('admin_newitem', { ItemId: itemId });
});


module.exports = router;
``