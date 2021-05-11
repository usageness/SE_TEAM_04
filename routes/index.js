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
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/notice", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/product", function (req, res, next) {
  res.render("product", { title: "Express" });
});

router.route("/address").get(getAddress).post(postAddress);

router.route("/address/new").get(getAddressRegister).post(postAddressRegister);

router.route("/address/:addressId/update").get(getUpdateAddress).post(postUpdateAddress);

router.route("/address/:addressId/delete").post(deleteAddress);
router.use("/admin", adminRouter);

module.exports = router;
