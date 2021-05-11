var express = require("express");
var router = express.Router();
const User = require("../../models").User;
const { isLoggedIn } = require("./middleware");
const {
  getEventad,
  postEventad,
  getUpdateEventad,
  postUpdateEventad,
  deleteEventad
} = require("../../controllers/eventadController");
const db = require("../../models");

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

  res.redirect('/admin');
});

router.get("/eventad", isLoggedIn, getEventad);


router.post("/eventad",isLoggedIn,postEventad);

router
  .route("/eventad/:eventadId")
  .get( isLoggedIn, getUpdateEventad)
  .post(isLoggedIn, postUpdateEventad);

router
  .route("/eventad/:eventadId/delete")
  .post(isLoggedIn, deleteEventad);

router.get("/item", isLoggedIn, async function (req, res, next) {
  var products = await db.Product.findAll({
    attributes: ["id", "title", "price"],
  });
  res.render("admin_item", { items: products });
});


router
  .route("/newitem")
  .get(isLoggedIn,function (req, res, next) {
    var itemId = "-";

    res.render("admin_newitem", { ItemId: itemId });
  })
  .post(isLoggedIn, async function (req, res, next) {
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
    if(product){
      req.session.save(() => {
        res.redirect('/admin/item/'+product.id);
      });
    }else{
      res.sendStatus(400);
    }
  });


router
  .route("/item/:itemId")
  .get(isLoggedIn, function (req, res, next) {
    console.log("/item/:itemId get");

    var itemId = req.params.itemId;

    var product = await db.Product.findOne({
      where: {
        id: itemId,
      },
    });
    res.render("admin_item_detail", { item: product });
  })
  .put(isLoggedIn,function (req, res, next) {
    var itemId = req.params.itemId;
    var product = await db.Product.findOne({
      where: {
        id: itemId,
      }
    });
    product.title =  req.body.name;
    product.designer =  req.body.creator;
    product.tag =  "태그";
    product.imageurl =  "-";
    product.url =  "-";
    product.content =  req.body.description;
    product.price =  req.body.price;
    product.playersmin =  req.body.peoplemin;
    product.playersmax =  req.body.peoplemax;
    product.playtime =  10;
    product.difficulty =  1;
    product.deliveryfee =  2000;
    var result = await product.save();

    if (result) {
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  })
  .delete(isLoggedIn,function (req, res, next) {
    var itemId = req.params.itemId;
    var product = await db.Product.findOne({
      where: {
        id: itemId,
      }
    });
    console.log("delete")
    await product.destroy();
    var result = await product.save();
    if (result) {
      res.sendStatus(200);
    }else {
      res.sendStatus(400);
    }
  });

router
  .route(isLoggedIn,"/item/new")
  .get(function (req, res, next) {
    var itemId = "-";

    res.render("admin_newitem", { ItemId: itemId });
  })
  .post(function (req, res, next) {
    var itemId = "-";

    res.render("admin_newitem", { ItemId: itemId });
  });

module.exports = router;
