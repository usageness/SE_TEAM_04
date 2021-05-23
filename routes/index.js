var express = require("express");
var router = express.Router();

var adminRouter = require("./admin");

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

router.get('/address', getAddress);

router.route("/address/new").get(getAddressRegister).post(postAddressRegister);

router.get('/search', function(req, res, next) {
  let session = req.session;
  res.render('search', { title: 'Express', session: session });
});

router.route("/address/:addressId/delete").post(deleteAddress);

router.route("/address/:addressId/update").get(getUpdateAddress).post(postUpdateAddress);
router.use("/admin", adminRouter);

module.exports = router;
