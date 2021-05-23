var express = require("express");
const fs = require('fs')

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
  var dateMin = new Date()
  var dateMax = new Date()

  dateMin.setDate(dateMin.getDate() - 7)

  var dMin = (dateMin.getMonth() + 1) + '/' + dateMin.getDate() + '/' + dateMin.getFullYear();
  var dMax = (dateMax.getMonth() + 1) + '/' + dateMax.getDate() + '/' + dateMax.getFullYear();

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
    where: {
      hidden: false
    }
  });
  res.render("admin_item", { items: products });
});

const multer = require('multer');
const mainImageUpload = multer({ dest: 'data/image/' });

router
  .route("/newitem")
  .get(isLoggedIn, async function (req, res, next) {
    var itemId = "-";
    var category = await db.Category.findAll();
    res.render("admin_newitem", { ItemId: itemId, category: category});
  })
  .post(isLoggedIn, mainImageUpload.single('mainImageName'), async function (req, res, next) {
    // console.log(req.params)
    // console.log(req.body)
    try {
      var date = new Date()
      var dStr = date.getFullYear() + (date.getMonth() + 1)  + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds() + '_' +  (Math.floor(Math.random() * (99 - 10)) + 10) ;

      const fileText = req.body.mainImageText
      const fileName = 'data/image/'+  dStr +'.' + req.body.mainImageName.split('.')[req.body.mainImageName.split('.').length - 1]
      var base64Data = fileText.replace(/^data:image\/png;base64,/, "").replace(/^data:image\/jpeg;base64,/, "");

      fs.writeFile(fileName, base64Data, 'base64', function(err) {
        console.log(err);
      });
    } catch (error) {
      console.log(error)
      res.sendStatus(400);
      return;
    }
    
    try {
      var itemId = "-";
      var product = await db.Product.create({
        title: req.body.name,
        designer: req.body.creator,
        tag: "태그",
        imageurl: '/' + dStr + '.' + req.body.mainImageName.split('.')[req.body.mainImageName.split('.').length - 1],
        url: "-",
        content: req.body.description,
        price: req.body.price,
        playersMin: req.body.peopleMin,
        playersMax: req.body.peopleMax,
        playTime: 10,
        difficulty: 1,
        deliveryFee: 2000,
      });
      var category = await db.Category.findOne({
        where: {
          name: req.body.category
        }
      });
      product.categoryinId = category.id;
      // console.log(product)
      // product.setcategoryin(category)
      await product.save()
      // await db.sequelize.query("UPDATE product SET categoryinId = " +category.id + " WHERE id = " + product.id);
    } catch (error) {
      console.log(error)
      res.sendStatus(400);
      return;
    }
    
    if(product){
      res.sendStatus(200);

      // req.session.save(() => {
      //   res.redirect('/admin/item/'+product.id);
      // });
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
    product.hidden = true;
    var result = await product.save();
    if (result) {
      res.sendStatus(200);
    }else {
      res.sendStatus(400);
    }
  });
  
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

router.get("/order", isLoggedIn, async function (req, res, next) {
  var dateMin = new Date()
  var dateMax = new Date()

  dateMin.setDate(dateMin.getDate() - 7)
  if(req.params.dateMin != undefined && req.params.dateMin != undefined){
    var dateMin = new Date(req.query.dateMin.slice(4, 8), (req.query.dateMin.slice(0, 2) - 1), req.query.dateMin.slice(2, 4), 0, 0, 0)
    var dateMax = new Date(req.query.dateMax.slice(4, 8), (req.query.dateMax.slice(0, 2) - 1), req.query.dateMax.slice(2, 4), 23, 59, 59)
    dateMin.setHours(dateMin.getHours() + 9)
    dateMax.setHours(dateMax.getHours() + 9)
  }

  var dMin = (dateMin.getMonth() + 1) + '/' + dateMin.getDate() + '/' + dateMin.getFullYear();
  var dMax = (dateMax.getMonth() + 1) + '/' + dateMax.getDate() + '/' + dateMax.getFullYear();

  
  var logs = await db.PurchaseLog.findAll({
    where: {
      date: {
        [db.Sequelize.Op.gte]: dateMin,
        [db.Sequelize.Op.lte]: dateMax
      }
      
    },
    attributes: ["id", "date", "count", "status"],
    include:[
      {
        model: db.Product,
        as: 'purchase',
        attributes: ['id', 'title']
      },
    ]
  });
  res.render("admin_order", { logs: logs, dateMin: dMin, dateMax: dMax});
});





module.exports = router;
