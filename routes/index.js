var express = require("express");
var router = express.Router();
const db = require("../models");
var adminRouter = require('./admin');
var payRouter = require('./pay.js');
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
const {route} = require("./admin");
const {eventadVisibelCheck, getEventadDetail} = require("../controllers/eventadController");
const {getProductDetail} = require("../controllers/productController");
const {getQna, postQna, getQnaList, getQnaAdd} = require("../controllers/qnaController");

/* GET home page. */
router.get('/', eventadVisibelCheck, async function (req, res, next) {
    let session = req.session;
    let cartCount = 0;

    let products = await db.Product.findAll({
        attributes: ["id", "title", "price", "imageurl", "content"],
        order: [["id", "DESC"]]
    });

    let category = await db.Category.findAll({
        attributes: ["id", "name"],
    });

    let eventadList = await db.Eventad.findAll({where: {visible: 1}});
    let logs = await db.PurchaseLog.findAll({
        limit: 4,
        group: ['productId'],
        attributes: [
            'productId',
            [db.Sequelize.fn('sum', db.sequelize.col('count')), 'countAll'],
        ],
        order: [
            [db.Sequelize.fn('sum', db.sequelize.col('count')), 'DESC'],
        ],
        include: [
            {
                model: db.Product,
                as: "purchase",
                attributes: [
                    "id", "title", "price", "imageurl", "content"
                ]
            }
        ]
    })

    if (req.session.user_id !== undefined) {
        const user = await db.User.findOne({
            where: {
                user_id: req.session.user_id,
            }
        });

        cartCount = await db.Cart.count({
            where: {
                userId: user.id
            }
        });
    }

    let hotProducts = []
    // console.log(logs)
    for (let i = 0; i < logs.length; i++) {
        hotProducts.push(logs[i].dataValues.purchase.dataValues);
    }

    res.render('index', {
        title: 'Express',
        session: session,
        nickname: session.nickname,
        items: products,
        hotItems: hotProducts,
        category: category,
        cartCount: cartCount,
        data: {
            eventadList
        }
    });
});

router.get('/image/:imageFileName', async function (req, res, next) {
    let session = req.session;
    var imageFileName = req.params.imageFileName;


    res.sendFile(path.join(__dirname, '../data/image/' + imageFileName));
});

router.get('/info', async function (req, res, next) {
    let session = req.session;
    let cartCount = 0;

    if (req.session.user_id !== undefined) {
        const user = await db.User.findOne({
            where: {
                user_id: req.session.user_id,
            }
        });

        cartCount = await db.Cart.count({
            where: {
                userId: user.id
            }
        });
    }

    let category = await db.Category.findAll({
        attributes: ["id", "name"],
    });
    res.render('info', {title: 'Express', session: session, category: category, cartCount: cartCount});
});

router.get('/product', async function (req, res, next) {
    let session = req.session;
    let cate = req.query.c;
    let category = await db.Category.findAll({
        attributes: ["id", "name"],
    });
    let sort = req.query.sortby ? req.query.sortby : 0;
    let by = req.query.b ? req.query.b : 0;
    let cartCount = 0;
    let offset = 0;
    let pageNum = req.query.page;
    let sorting = ['title', 'price', 'id'];
    let byList = ['desc', 'asc'];

    if (pageNum > 1) {
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

    if (req.session.user_id !== undefined) {
        const user = await db.User.findOne({
            where: {
                user_id: req.session.user_id,
            }
        });

        cartCount = await db.Cart.count({
            where: {
                userId: user.id
            }
        });
    }

    res.render('product', {
        title: 'Express',
        session: session,
        items: products,
        category: category,
        cate: cate,
        sortby: sort,
        by: by,
        count: count,
        cartCount: cartCount
    });
});

router.get('/product/:productId', getProductDetail);

router.get('/search', async function (req, res, next) {
    let session = req.session;
    let searchWord = req.query.q;
    let cate = req.query.c;
    let min = req.query.minPrice;
    let max = req.query.maxPrice;
    let sort = req.query.sortby ? req.query.sortby : 0;
    let by = req.query.b ? req.query.b : 0;
    let pageNum = req.query.page;
    let offset = 0;
    let cartCount = 0;
    let count;
    let sorting = ['title', 'price', 'id'];
    let byList = ['desc', 'asc'];

    if (pageNum > 1) {
        offset = 12 * (pageNum - 1);
    }
    let products;

    let category = await db.Category.findAll({
        attributes: ["id", "name"],
    });

    if (req.session.user_id !== undefined) {
        const user = await db.User.findOne({
            where: {
                user_id: req.session.user_id,
            }
        });

        cartCount = await db.Cart.count({
            where: {
                userId: user.id
            }
        });
    }

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

    if (cate) {
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

    if (min) {
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

    if (max) {
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

    if (cate && min) {
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

    if (cate && max) {
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

    if (min && max) {
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

    if (min && max && cate) {
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
        count: count,
        cartCount: cartCount
    });
});

// review
router.post('/product/:productId/review', async function (req, res, next) {
    let session = req.session;
    let result = false;
    console.log(req.body)
    const productId = req.params.productId;
    const user = await db.User.findOne({where: {user_id: session.user_id}})

    const purchaseLogs = await db.PurchaseLog.findAll({
        where: {
            userId: user.id,
            productId: productId,
            status: 4
        },
        // order:[
        //   ["date", "DESC"]
        // ],
        include: [{
            model: db.Review,
            as: 'reviews',
        }
        ]
    })

    if (purchaseLogs.length == 0) {
        console.log("no purchaseLog");
        res.status(400).send("구매 내역이 없거나 최근 구매 항목이 구매 확정 전입니다.");
        return;
    }
    console.log(purchaseLogs)
    console.log(purchaseLogs[0].reviews)
    let index = 0;
    for (index = 0; index < purchaseLogs.length; index++) {
        const purchaseLog = purchaseLogs[index];
        if (!purchaseLog.reviews) {
            break;
        }
    }
    if (index == purchaseLogs.length) {
        console.log("no purchaseLog");
        res.status(400).send("상품평을 이미 작성했거나 최근 구매 항목이 구매 확정 전입니다.");
        return;
    }
    const reviews = await db.Review.create({
        title: req.body.content,
        content: req.body.content,
        score: req.body.score,
        date: new Date,
        like: req.body.btnradio,
        ProductId: productId,
        reviewId: purchaseLogs[index].id,
        userId: user.id
    });
    result = true

    if (result) {
        res.sendStatus(200)
    } else {
        res.status(400).send("실패했습니다.");
    }
});

router.route('/event/:eventadId').get(getEventadDetail);

router.get('/user/:userId/address', getAddress);
router.post('/user/:userId/address', postAddress);

router.route("/user/:userId/address/new").get(getAddressRegister).post(postAddressRegister);

router.route("/user/:userId/address/:addressId/delete").post(deleteAddress);

router.route("/user/:userId/address/:addressId/update").get(getUpdateAddress).post(postUpdateAddress);

router.route("/qna/:logId").get(getQna).post(postQna);
router.route("/qnaList/:logId").get(getQnaList);
router.route("/qna/:logId/add").get(getQnaAdd).post(postQna);

router.use("/admin", adminRouter);
router.use("/pay", payRouter);
router.use("/coupon", require('./coupon'));
router.use("/order", require('./order'));

module.exports = router;
