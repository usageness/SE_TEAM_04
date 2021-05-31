var express = require("express");
const fs = require('fs')
const crypto = require('crypto');

var router = express.Router();
const User = require("../../models").User;
const { isLoggedIn } = require("./middleware");
const {
  getEventad,
  postEventad,
  getUpdateEventad,
  postUpdateEventad,
  deleteEventad,
  eventadVisibelCheck,
  
} = require("../../controllers/eventadController");
const db = require("../../models");

const multer = require('multer');
const mainImageUpload = multer({ dest: 'data/image/' });

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
  if (result !== null) {
    let salt = result.dataValues.salt;
    let dbPassword = result.dataValues.password;
    let inputPassword = req.body.password;
    let hashPassword = crypto.createHash("sha256").update(inputPassword + salt).digest("hex");

    console.log(result)
    if (
      result.user_id === req.body.user_id &&
      dbPassword === hashPassword
    ) {
        req.session.user_id = req.body.user_id;
        req.session.permission = 1;
        // res.render("admin_main", { title: "", session: req.session });
        res.redirect('/admin');
    } else {
      res.status(401).send("잘못된 접근입니다.");
    }
  }else{
    res.send('<script type="text/javascript">alert("아이디 또는 비밀번호가 일치하지 않습니다"); location.href = "/admin";</script>');
  }
});

router.get("/logout", function (req, res, next) {
  req.session.destroy();
  res.clearCookie(process.env.SESSION_SECRET);

  res.redirect('/');
});

router.get("/eventad", isLoggedIn, eventadVisibelCheck,getEventad);


router.post("/eventad",isLoggedIn, mainImageUpload.single('mainImageName'), postEventad);

router
  .route("/eventad/:eventadId")
  .get( isLoggedIn, getUpdateEventad)
  .post(isLoggedIn, mainImageUpload.single('mainImageName'), postUpdateEventad);

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
      var dStr = '' + date.getFullYear() + (date.getMonth() + 1)  + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds() ;
      // console.log(req.body.subImageFiles.slice(0,30))
      // console.log(JSON.parse(req.body.subImageFiles)[0])

      const fileText = req.body.mainImageText
      const fileName = dStr + '_' +  (Math.floor(Math.random() * (99 - 10)) + 10) + '.' + req.body.mainImageName.split('.')[req.body.mainImageName.split('.').length - 1]
      var base64Data = fileText.replace(/^data:image\/png;base64,/, "").replace(/^data:image\/jpeg;base64,/, "");

      fs.writeFile('data/image/' + 'productmainimage_' + fileName, base64Data, 'base64', function(err) {
        console.log(err);
      });

      var itemId = "-";
      var product = await db.Product.create({
        title: req.body.name,
        designer: req.body.creator,
        tag: "태그",
        imageurl: 'productmainimage_' + fileName,
        url: "-",
        content: req.body.description,
        price: req.body.price,
        playersMin: req.body.peopleMin,
        playersMax: req.body.peopleMax,
        playTime: 10,
        difficulty: 1,
        deliveryFee: req.body.deliveryFee,
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
      if(req.body.subImageFiles != undefined){
        var subFileText;
        var subFileName;
        var productImage;
        var subImageFiles = JSON.parse(req.body.subImageFiles)
        

        subImageFiles.forEach(async (subImageFile) => {
          date = new Date()
          dStr = '' + date.getFullYear() + (date.getMonth() + 1)  + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds();
          subFileNum = subImageFile.imageNum;
          subFileText = subImageFile.imageText;
          subFileName = dStr + '_' +  (Math.floor(Math.random() * (99 - 10)) + 10) + '.' + subImageFile.imageName.split('.')[subImageFile.imageName.split('.').length - 1];
          
          base64Data = subFileText.replace(/^data:image\/png;base64,/, "").replace(/^data:image\/jpeg;base64,/, "")
          fs.writeFile('data/image/' + 'productsubimage_' + subFileName, base64Data, 'base64', function(err) {
            console.log(err);
          });

          productImage = await db.ProductImage.create({
            num: subFileNum,
            fileName: 'productsubimage_' + subFileName,
          });
          productImage.ProductId = product.id;
          productImage.save();
        });
      }
      


    } catch (error) {
      console.log(error)
      res.sendStatus(400);
      return;
    }
    
    
    if(product){
      res.sendStatus(200);
      
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
      include: [{
        model: db.ProductImage,
      }]
    });
    var category = await db.Category.findAll();
    console.log(product)
    res.render("admin_item_detail", { item: product, category: category });
  })
  .put(isLoggedIn, mainImageUpload.single('mainImageName'), async function (req, res, next) {
    // console.log(req.body)
    // console.log(req.params)

    if(req.body.deleteSubImageList != undefined){
      var deleteSubImageList = JSON.parse(req.body.deleteSubImageList)
      deleteSubImageList.forEach(async id => {
        var productImage = await db.ProductImage.findOne({
          where: {
            id: id,
          },
        });
        await productImage.destroy();
      });
    }

    

    var itemId = req.params.itemId;
    var product = await db.Product.findOne({
      where: {
        id: itemId,
      },
      include: [{
        model: db.ProductImage
      }]
    });
    product.title =  req.body.name;
    product.designer =  req.body.creator;
    product.tag =  "태그";
    product.url =  "-";
    product.content =  req.body.description;
    product.price =  req.body.price;
    product.deliveryFee =  req.body.deliveryFee;
    product.playersMin =  req.body.peopleMin;
    product.playersMax =  req.body.peopleMax;
    product.playTime =  10;
    product.difficulty =  1;
    product.categoryinId = req.body.category;
    console.log(1)

    if(req.body.mainImageName != undefined){
      var date = new Date()
      var dStr = '' + date.getFullYear() + (date.getMonth() + 1)  + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds() ;
      // console.log(req.body.subImageFiles.slice(0,30))
      // console.log(JSON.parse(req.body.subImageFiles)[0])

      const fileText = req.body.mainImageText
      const fileName = dStr + '_' +  (Math.floor(Math.random() * (99 - 10)) + 10) + '.' + req.body.mainImageName.split('.')[req.body.mainImageName.split('.').length - 1]
      var base64Data = fileText.replace(/^data:image\/png;base64,/, "").replace(/^data:image\/jpeg;base64,/, "");

      fs.writeFile('data/image/' + 'productmainimage_' + fileName, base64Data, 'base64', function(err) {
        console.log(err);
      });
      product.imageurl =  'productmainimage_' + fileName;

    }

    if(req.body.subImageFiles != undefined){
      var subFileText;
      var subFileName;
      var productImage;
      var subImageFiles = JSON.parse(req.body.subImageFiles)
      

      subImageFiles.forEach(async (subImageFile) => {
        var date = new Date()
        var dStr = '' + date.getFullYear() + (date.getMonth() + 1)  + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds();
        subFileNum = subImageFile.imageNum;
        subFileText = subImageFile.imageText;
        subFileName = dStr + '_' +  (Math.floor(Math.random() * (99 - 10)) + 10) + '.' + subImageFile.imageName.split('.')[subImageFile.imageName.split('.').length - 1];
        
        base64Data = subFileText.replace(/^data:image\/png;base64,/, "").replace(/^data:image\/jpeg;base64,/, "")
        fs.writeFile('data/image/' + 'productsubimage_' + subFileName, base64Data, 'base64', function(err) {
          console.log(err);
        });

        productImage = await db.ProductImage.create({
          num: subFileNum,
          fileName: 'productsubimage_' + subFileName,
        });
        productImage.ProductId = product.id;
        productImage.save();
      });

    }
    console.log(1)

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
  // console.log(logs)
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
  // console.log(logs)
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

router.route("/order")
.get(isLoggedIn, async function (req, res, next) {
  var dateMin = new Date()
  var dateMax = new Date()

  dateMin.setDate(dateMin.getDate() - 7)
  if(req.params.dateMin != undefined && req.params.dateMax != undefined){
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
    attributes: [
      "id", "date", "count", "status", 'amount', 'count', 'logId', 
      [db.Sequelize.literal('SUM(`amount` * `count`)'), 'amountAll'],
      [db.Sequelize.fn('COUNT', db.Sequelize.col('purchaselog.id')), 'productsCount'],
    ],
    include:[
      {
        model: db.Product,
        as: 'purchase',
        attributes: ['id', 'title']
      },
    ],
    group: ['logId']
  });
  // console.log(logs)
  console.log(logs[6].id)
  console.log(logs[6].dataValues.amountAll)
  res.render("admin_order", { logs: logs, dateMin: dMin, dateMax: dMax});
})
.put(isLoggedIn, async function (req, res, next) {
  const logId = req.body.logId;
  const currentStatus = req.body.currentStatus;
  const targetStatus = req.body.targetStatus;
  const log = await db.PurchaseLog.findOne({
    where: {
      logId: logId,
    }
  })
  console.log(log.status)
  console.log(currentStatus)
  console.log(targetStatus)

  var result = false;
  if(currentStatus == 1 && log.status == 1 && targetStatus == 2){
    result = await db.PurchaseLog.update({status: 2},{where:{logId: logId}});
  }else if(currentStatus == 2 && log.status == 2 && targetStatus == 3){
    result = await db.PurchaseLog.update({status: 3},{where:{logId: logId}});

  }

  if(result){
    res.sendStatus(200);
  }else{
    res.sendStatus(400);
  }
  

})






module.exports = router;
