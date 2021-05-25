var express = require("express");
var router = express.Router();
const db = require("../models");
var adminRouter = require('./admin');
const sequelize = require("sequelize");
const Op = sequelize.Op;
const path = require('path')

const {
  getAddress,
  postAddress,
  getAddressRegister,
  postAddressRegister,
  getUpdateAddress,
  postUpdateAddress,
  deleteAddress,
} = require("../controllers/addressController");
const { route } = require("./admin");

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
router.get('/image/:imageFileName', async function(req, res, next) {
  let session = req.session;
  var imageFileName = req.params.imageFileName;


  res.sendFile(path.join(__dirname, '../data/image/' + imageFileName));
});

router.get('/notice', function(req, res, next) {
  let session = req.session;
  res.render('index', { title: 'Express', session: session });
});

router.get('/product', function(req, res, next) {
  let session = req.session;
  res.render('product', { title: 'Express', session: session });
});

router.get('/address', getAddress);

router.route("/address/new").get(getAddressRegister).post(postAddressRegister);

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

router.route("/address/:addressId/delete").post(deleteAddress);

router.route("/address/:addressId/update").get(getUpdateAddress).post(postUpdateAddress);
router.use("/admin", adminRouter);

module.exports = router;
