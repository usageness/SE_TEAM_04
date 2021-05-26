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
    attributes: ["id", "title", "price", "imageurl", "content"],
    order: [["id", "DESC"]]
  });
  let category = await db.Category.findAll({
    attributes: ["id", "name"],
  });
  var eventadList = await db.Eventad.findAll({});

  res.render('index', {
    title: 'Express',
    session: session,
    nickname: session.nickname,
    items: products,
    category: category,
    data:{
      eventadList
    }
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

router.get('/product', async function(req, res, next) {
  let session = req.session;
  let cate = req.query.c;
  let category = await db.Category.findAll({
    attributes: ["id", "name"],
  });
  let sort = req.query.sortby ? req.query.sortby : 0;
  let by = req.query.b ? req.query.b : 0;
  let offset = 0;
  let pageNum = req.query.page;
  let sorting = ['title', 'price', 'id'];
  let byList = ['desc', 'asc'];

  if(pageNum > 1){
    offset = 12 * (pageNum - 1);
  }

  let products = await db.Product.findAll({
    offset: offset,
    limit: 12,
    where: {
      categoryinId: (req.query.c)
    },
    order: [[sorting[sort], byList[by]]]
  });

  let count = await db.Product.count({
    where: {
      categoryinId: (req.query.c)
    }
  });

  res.render('product', {
    title: 'Express',
    session: session,
    items: products,
    category: category,
    cate: cate,
    sortby: sort,
    by: by,
    count: count
  });
});

router.get('/address', getAddress);

router.route("/address/new").get(getAddressRegister).post(postAddressRegister);

router.get('/search', async function(req, res, next) {
  let session = req.session;
  let searchWord = req.query.q;
  let cate = req.query.c;
  let min = req.query.minPrice;
  let max = req.query.maxPrice;
  let sort = req.query.sortby ? req.query.sortby : 0;
  let by = req.query.b ? req.query.b : 0;
  let pageNum = req.query.page;
  let offset = 0;
  let count;
  let sorting = ['title', 'price', 'id'];
  let byList = ['desc', 'asc'];

  if(pageNum > 1){
    offset = 12 * (pageNum - 1);
  }
  let products;

  let category = await db.Category.findAll({
    attributes: ["id", "name"],
  });

  products = await db.Product.findAll({
    offset: offset,
    limit: 12,
    where: {
      [Op.and]: [
        {
          title: {
            [Op.like]: "%" + searchWord + "%",
          }
        },
        {
          hidden: 0
        }
      ]
    },
    order: [[sorting[sort], byList[by]]]
  });
  count = await db.Product.count({
    where: {
      [Op.and]: [
        {
          title: {
            [Op.like]: "%" + searchWord + "%",
          }
        },
        {
          hidden: 0
        }
      ]
    }
  });

  if(cate) {
    products = await db.Product.findAll({
      offset: offset,
      limit: 12,
      where: {
        [Op.and]: [
          {
            title: {
              [Op.like]: "%" + searchWord + "%",
            }
          },
          {
            categoryinId: (req.query.c)
          },
          {
            hidden: 0
          }
        ]
      },
      order: [[sorting[sort], byList[by]]]
    });
    count = await db.Product.count({
      where: {
        [Op.and]: [
          {
            title: {
              [Op.like]: "%" + searchWord + "%",
            }
          },
          {
            categoryinId: (req.query.c)
          },
          {
            hidden: 0
          }
        ]
      }
    });
  }

  if(min) {
    products = await db.Product.findAll({
      offset: offset,
      limit: 12,
      where: {
        [Op.and]: [
          {
            title: {
              [Op.like]: "%" + searchWord + "%",
            }
          },
          {
            price: {
              [Op.gte]: min
            }
          },
          {
            hidden: 0
          }
        ]
      },
      order: [[sorting[sort], byList[by]]]
    });
    count = await db.Product.count({
      where: {
        [Op.and]: [
          {
            title: {
              [Op.like]: "%" + searchWord + "%",
            }
          },
          {
            price: {
              [Op.gte]: min
            }
          },
          {
            hidden: 0
          }
        ]
      }
    });
  }

  if(max) {
    products = await db.Product.findAll({
      offset: offset,
      limit: 12,
      where: {
        [Op.and]: [
          {
            title: {
              [Op.like]: "%" + searchWord + "%",
            }
          },
          {
            price: {
              [Op.lte]: max
            }
          },
          {
            hidden: 0
          }
        ]
      },
      order: [[sorting[sort], byList[by]]]
    });
    count = await db.Product.count({
      where: {
        [Op.and]: [
          {
            title: {
              [Op.like]: "%" + searchWord + "%",
            }
          },
          {
            price: {
              [Op.lte]: max
            }
          },
          {
            hidden: 0
          }
        ]
      }
    });
  }

  if(cate && min) {
    products = await db.Product.findAll({
      offset: offset,
      limit: 12,
      where: {
        [Op.and]: [
          {
            title: {
              [Op.like]: "%" + searchWord + "%",
            }
          },
          {
            categoryinId: (req.query.c)
          },
          {
            price: {
              [Op.gte]: min
            }
          },
          {
            hidden: 0
          }
        ]
      },
      order: [[sorting[sort], byList[by]]]
    });
    count = await db.Product.count({
      where: {
        [Op.and]: [
          {
            title: {
              [Op.like]: "%" + searchWord + "%",
            }
          },
          {
            categoryinId: (req.query.c)
          },
          {
            price: {
              [Op.gte]: min
            }
          },
          {
            hidden: 0
          }
        ]
      }
    });
  }

  if(cate && max) {
    products = await db.Product.findAll({
      offset: offset,
      limit: 12,
      where: {
        [Op.and]: [
          {
            title: {
              [Op.like]: "%" + searchWord + "%",
            }
          },
          {
            categoryinId: (req.query.c)
          },
          {
            price: {
              [Op.lte]: max
            }
          },
          {
            hidden: 0
          }
        ]
      },
      order: [[sorting[sort], byList[by]]]
    });
    count = await db.Product.count({
      where: {
        [Op.and]: [
          {
            title: {
              [Op.like]: "%" + searchWord + "%",
            }
          },
          {
            categoryinId: (req.query.c)
          },
          {
            price: {
              [Op.lte]: max
            }
          },
          {
            hidden: 0
          }
        ]
      }
    });
  }

  if(min && max) {
    products = await db.Product.findAll({
      offset: offset,
      limit: 12,
      where: {
        [Op.and]: [
          {
            title: {
              [Op.like]: "%" + searchWord + "%",
            }
          },
          {
            [Op.and]: [
              {
                price: {
                  [Op.lte]: max
                }
              },
              {
                price: {
                  [Op.gte]: min
                }
              }
            ]
          },
          {
            hidden: 0
          }
        ]
      },
      order: [[sorting[sort], byList[by]]]
    });
    count = await db.Product.count({
      where: {
        [Op.and]: [
          {
            title: {
              [Op.like]: "%" + searchWord + "%",
            }
          },
          {
            [Op.and]: [
              {
                price: {
                  [Op.lte]: max
                }
              },
              {
                price: {
                  [Op.gte]: min
                }
              }
            ]
          },
          {
            hidden: 0
          }
        ]
      },
      order: [[sorting[sort], byList[by]]]
    });
  }

  if(min && max && cate) {
    products = await db.Product.findAll({
      offset: offset,
      limit: 12,
      where: {
        [Op.and]: [
          {
            title: {
              [Op.like]: "%" + searchWord + "%",
            }
          },
          {
            [Op.and]: [
              {
                price: {
                  [Op.lte]: max
                }
              },
              {
                price: {
                  [Op.gte]: min
                }
              }
            ]
          },
          {
            categoryinId: (req.query.c)
          },
          {
            hidden: 0
          }
        ]
      },
      order: [[sorting[sort], byList[by]]]
    });
    count = await db.Product.count({
      where: {
        [Op.and]: [
          {
            title: {
              [Op.like]: "%" + searchWord + "%",
            }
          },
          {
            [Op.and]: [
              {
                price: {
                  [Op.lte]: max
                }
              },
              {
                price: {
                  [Op.gte]: min
                }
              }
            ]
          },
          {
            categoryinId: (req.query.c)
          },
          {
            hidden: 0
          }
        ]
      }
    });
  }

  res.render('search', {
    title: 'Express',
    session: session,
    items: products,
    cate: cate,
    category: category,
    searchWord: searchWord,
    min: min,
    max: max,
    sortby: sort,
    by: by,
    count: count
  });
});

router.route("/address/:addressId/delete").post(deleteAddress);

router.route("/address/:addressId/update").get(getUpdateAddress).post(postUpdateAddress);
router.use("/admin", adminRouter);

module.exports = router;
