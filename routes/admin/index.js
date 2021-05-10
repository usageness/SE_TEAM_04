var express = require("express");
var router = express.Router();
const db = require("../../models");
const { isLoggedIn, isNotLoggedIn } = require("./middleware");

router.get("/", isLoggedIn, function (req, res, next) {
  res.render("admin_main", { title: "AdminMain" });
});

router.get("/login", (req, res, next) => {
  res.render("admin_login", { title: "", session: req.session });
});

router.post("/login", async (req, res, next) => {
  const result = await db.User.findOne({ where: { permission: 1 } });
  if (
    result !== null &&
    result.userid === req.body.userid &&
    result.password === req.body.password
  ) {
    req.session.userid = req.body.userid;
    res.render("admin_main", { title: "", session: req.session });
  } else {
    res.status(401).send("잘못된 접근입니다.");
  }
});

router.get("/logout", function (req, res, next) {
  req.session.destroy();
  res.clearCookie(process.env.SESSION_SECRET);

  res.render("admin_login", { title: "", session: req.session });
});

router.get("/eventad", isLoggedIn, function (req, res, next) {
  res.render("admin_eventad_detail", { title: "" });
});

router.get("/item", isLoggedIn, function (req, res, next) {
  res.render("admin_item", { title: "" });
});


router
  .route("/newitem")
  .get(function (req, res, next) {
    var itemId = "-";

    res.render("admin_newitem", { ItemId: itemId });
  })
  .post(async function (req, res, next) {
    var itemId = "-";
    var product = await db.Product.create({
      title: req.body.name,
      designer: req.body.creator,
      tag: "태그",
      imageurl: "-",
      url: "-",
      content: req.body.description,
      price: req.body.price,
      playersmin: req.body.peoplemin,
      playersmax: req.body.peoplemax,
      playtime: 10,
      difficulty: 1,
      deliveryfee: 2000,
    });
    res.render("admin_login", { title: "", session: req.session });
  });


router
  .route("/item/:itemId")
  .get(function (req, res, next) {
    console.log("/item/:itemId get");

    var itemId = req.params.itemId;
    res.render("admin_item_detail", { ItemId: itemId });
  })
  .put(function (req, res, next) {
    var itemId = req.params.itemId;
    console.log(req.body);
    var result = false;

    if (result) {
      res.send("200");
    } else {
      res.send("400");
    }
  })
  .delete(function (req, res, next) {
    var itemId = req.params.itemId;

    var result = false;

    if (result) {
      res.send("200");
    } else {
      res.send("400");
    }
  });


module.exports = router;
