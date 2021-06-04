var express = require('express');
var router = express.Router();
const db = require("../models");


/* GET home page. */
router.get('/', async function (req, res, next) {
    let session = req.session;
    let category = await db.Category.findAll({
        attributes: ["id", "name"],
    });
    if(req.session.user_id == undefined){
        res.send('로그인 후 접속하세요.<br><a href="/">홈으로</a> ')
        return;
    }

    const user = await db.User.findOne({
        where:{
            user_id: req.session.user_id,
        }
    })
    await db.Cart.update({
        status:0
    },
    {
        where: {
            userId: user.id
        }
    })
    await db.Coupon_User.update({
        used: 0
    },
    {
        where: {
            UserId: user.id,
            used: 1
        },
    })
    const cart = await db.Cart.findAll({
        where: {
            userId: user.id
        },
        include: [{
            model: db.Product,
            as: 'products',
            include: [{
                model: db.Category,
                as: "categoryin"
            }]
        }]
    })
    const _user = await db.User.findOne({
        where:{
            user_id: req.session.user_id,
        },
        include: [{
            model: db.Coupon,
            as: 'coupon',
            through: {
                model: db.Coupon_User,
                where:{
                    used: 0
                }
            },
            
        }]
    })

    // console.log(cart)
    // console.log(_user.coupon)
    res.render('cart', {title: 'Express', session: session, carts: cart, category: category, coupon: _user?_user.coupon:[]});
});

router.post('/', async function (req, res, next) {
    let session = req.session;
    if(req.session.user_id == undefined){
        res.sendStatus('400')
        return;
    }

    

    const user = await db.User.findOne({
        where:{
            user_id: req.session.user_id,
        },
    })
    

    const product = await db.Product.findOne({
        where:{
            id : req.body.itemId,
        },
    })
    const cart = await db.Cart.findOne({
        where: {
            userId: user.id,
            status: 0,
        },
        include: [{
            model: db.Product,
            as: 'products',
            where: {
                id: req.body.itemId,
            } 
        }]
    })
    

    // console.log(product)
    // console.log(cart)
    var result;
    if(cart != null){
        // product.carts[0].id
        res.sendStatus(300);
        return;
    }else{
        const _cart = await db.Cart.create({
            userId: user.id,
            amount: 1
        })
        _cart.addProducts(product, {
            through: {createAt: new Date(), updateAt: new Date() }
        })
        result = await _cart.save();
    }

    // console.log(product)
    // console.log(product.carts)
    // console.log(cart.products)
    // res.render('cart', {title: 'Express', session: session, carts: cart});
    if(result){
        res.sendStatus(200);
    }else{
        res.sendStatus(400);

    }
});

router.delete('/', async function (req, res, next) {
    let session = req.session;
    if(req.session.user_id == undefined){
        res.sendStatus('400')
        return;
    }
    var result = true;

    const user = await db.User.findOne({
        where:{
            user_id: req.session.user_id,
        },
    })

    var cartList = req.body.cartList;
    var cart;
    for(var i = 0; i < cartList.length; i++){
        cart = await db.Cart.findOne({
            where: {
                id: cartList[i]
            }
        })
        await cart.destroy()
    }
   

    if(result){
        res.sendStatus(200);
    }else{
        res.sendStatus(400);

    }
});

module.exports = router;
