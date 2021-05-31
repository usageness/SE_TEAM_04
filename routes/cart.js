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
    const cart = await db.Cart.findAll({
        where: {
            userId: user.id
        },
        include: [{
            model: db.Product,
            as: 'products',
        }]
    })

    console.log(cart)
    res.render('cart', {title: 'Express', session: session, carts: cart, category: category});
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
    // const cart = await db.Cart.findOne({
    //     where: {
    //         userId: user.id,
    //     },
    //     include: [{
    //         model: db.Product,
    //         as: 'products',
    //         on: {
    //             id: req.body.itemId,
    //         } 
    //     }]
    // })
    console.log(product)
    console.log(cart)
    var result;
    if(cart != null){
        // product.carts[0].id
        // const cart = await db.Cart.findOne({
        //     where: {
        //         id: product.carts[0].id,
        //     }
        // })
        // cart.amount += 1;
        // result = await cart.save();
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
