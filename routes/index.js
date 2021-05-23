var express = require('express');
var router = express.Router();
const db = require("../models");
var adminRouter = require('./admin');
const sequelize = require("sequelize");
const Op = sequelize.Op;

const {postAddress} =require("../controllers/addressController");

/* GET home page. */
router.get('/', async function(req, res, next) {
  let session = req.session;

  var products = await db.Product.findAll({
    attributes: ["id", "title", "price"],
  });

  res.render('index', {
    title: 'Express',
    session: session,
    nickname: session.nickname,
    items: products
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

router.get('/search', async function(req, res, next) {
  let session = req.session;
  let searchWord = req.query.q;

  let products = await db.Product.findAll({
    where:{
      title: {
        [Op.like]: "%" + searchWord + "%"
      }
    }
  });

  res.render('search', { title: 'Express', session: session, items: products });
});

router.use('/admin', adminRouter);

module.exports = router;
