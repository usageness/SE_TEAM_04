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
  dateMin = new Date()
  dateMax = new Date()

  dateMin.setDate(dateMin.getDate() - 7)

  dMin = (dateMin.getMonth() + 1) + '/' + dateMin.getDate() + '/' + dateMin.getFullYear();
  dMax = (dateMax.getMonth() + 1) + '/' + dateMax.getDate() + '/' + dateMax.getFullYear();

  res.render("admin_main", { title: "AdminMain", dateMin: dMin, dateMax: dMax });

});

router.get("/login", (req, res, next) => {
  res.render("admin_login", { title: "", session: req.session });
});

router.post("/login", async (req, res, next) => {
  const result = await db.User.findOne({ where: { permission: 1 } });
  console.log(result)
  if (
    result !== null &&
    result.user_id === req.body.user_id &&
    result.password === req.body.password
  ) {
    req.session.user_id = req.body.user_id;
    // res.render("admin_main", { title: "", session: req.session });
    res.redirect('/admin');
  } else {
    res.status(401).send("잘못된 접근입니다.");
  }
});

router.get("/logout", function (req, res, next) {
  req.session.destroy();
  res.clearCookie(process.env.SESSION_SECRET);

  res.redirect('/');
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
      playersMin: req.body.peopleMin,
      playersMax: req.body.peopleMax,
      playTime: 10,
      difficulty: 1,
      deliveryFee: 2000,
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
  .get(isLoggedIn, async function (req, res, next) {
    console.log("/item/:itemId get");

    var itemId = req.params.itemId;

    var product = await db.Product.findOne({
      where: {
        id: itemId,
      },
    });
    res.render("admin_item_detail", { item: product });
  })
  .put(isLoggedIn, async function (req, res, next) {
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
    product.playersMin =  req.body.peopleMin;
    product.playersMax =  req.body.peopleMax;
    product.playTime =  10;
    product.difficulty =  1;
    product.deliveryFee =  2000;
    var result = await product.save();

    if (result) {
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  })
  .delete(isLoggedIn, async function (req, res, next) {
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

// router
//   .route(isLoggedIn,"/salerate")
//   .get(function (req, res, next) {
//     console.log(req.params)
//     console.log(req.body)

//     res.json({ ItemId: 1 });
//   })
//   .post(function(req, res) {
//     res.send('nothing');
//   });
// Create a route for GET /user/test
router.get('/salerate', async function(req, res) {
  var minDate = new Date(req.query.minDate.slice(4, 8), (req.query.minDate.slice(0, 2) - 1), req.query.minDate.slice(2, 4), 0, 0, 0)
  var maxDate = new Date(req.query.maxDate.slice(4, 8), (req.query.maxDate.slice(0, 2) - 1), req.query.maxDate.slice(2, 4), 23, 59, 59)
  minDate.setHours(minDate.getHours() + 9)
  maxDate.setHours(maxDate.getHours() + 9)
  // console.log(minDate)
  // console.log(maxDate)
  var logs = await db.PurchaseLog.findAll({
    where: {
      date: {
        [db.Sequelize.Op.gte]: minDate,
        [db.Sequelize.Op.lte]: maxDate
      }
      
    },
    group: [db.sequelize.fn('date', db.sequelize.col('date'))],
    attributes: [
      'date', 
      [db.Sequelize.fn('count', db.sequelize.col('date')), 'count'], 
      [db.Sequelize.fn('sum', db.sequelize.col('amount')), 'amountDay'],
    ]
  })
  var result = []
  for(var i = 0; i < logs.length; i++){
    // result.push({date: logs[i].date, count: logs[i].count, sum: logs[i].sum})
    result.push(logs[i].dataValues)
  }
  res.json(result);
});


router.get('/bestitem', async function(req, res) {
  var minDate = new Date(req.query.minDate.slice(4, 8), (req.query.minDate.slice(0, 2 - 1)), req.query.minDate.slice(2, 4), 0, 0, 0)
  var maxDate = new Date(req.query.maxDate.slice(4, 8), (req.query.maxDate.slice(0, 2) - 1), req.query.maxDate.slice(2, 4), 23, 59, 59)
  minDate.setHours(minDate.getHours() + 9)
  maxDate.setHours(maxDate.getHours() + 9)
  
  var logs = await db.PurchaseLog.findAll({
    where: {
      date: {
        [db.Sequelize.Op.gte]: minDate,
        [db.Sequelize.Op.lte]: maxDate
      }
      
    },
    group: ['productId'],
    attributes: [
      'productId', 
      [db.Sequelize.fn('sum', db.sequelize.col('count')), 'countAll'],
    ],
    limit: 3,
    order: [
      [db.Sequelize.fn('sum', db.sequelize.col('count')), 'DESC'],
    ],
    include: [
      {
        model: db.Product,
        as: 'purchase',
        attributes:[
          'id', 'title'
        ]
      }
    ]
  })
  var result = []
  console.log(logs)
  for(var i = 0; i < logs.length; i++){
    result.push(logs[i].dataValues)
  }
  res.json(result);
});

router.get('/bestcategory', async function(req, res) {
  var minDate = new Date(req.query.minDate.slice(4, 8), (req.query.minDate.slice(0, 2 - 1)), req.query.minDate.slice(2, 4), 0, 0, 0)
  var maxDate = new Date(req.query.maxDate.slice(4, 8), (req.query.maxDate.slice(0, 2) - 1), req.query.maxDate.slice(2, 4), 23, 59, 59)
  minDate.setHours(minDate.getHours() + 9)
  maxDate.setHours(maxDate.getHours() + 9)
  
  var logs = await db.PurchaseLog.findAll({
    where: {
      date: {
        [db.Sequelize.Op.gte]: minDate,
        [db.Sequelize.Op.lte]: maxDate
      }
      
    },
    group: ['categoryinId'],
    attributes: [
      'productId', 
      [db.Sequelize.fn('sum', db.sequelize.col('count')), 'countAll'],
    ],
    limit: 3,
    order: [
      [db.Sequelize.fn('sum', db.sequelize.col('count')), 'DESC'],
    ],
    include: [
      {
        model: db.Product,
        as: 'purchase',
        attributes:[
          'id', 'title', 'CategoryId'
        ],
        include: [
          {
            model: db.Category,
            as: 'categoryin',
            attributes:[
              'id', 'name'
            ],
          }
        ]
      },
    ]
  })
  var result = []
  for(var i = 0; i < logs.length; i++){
    result.push(logs[i].dataValues)
  }
  res.json(result);
});

module.exports = router;
