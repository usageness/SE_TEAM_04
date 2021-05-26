var express = require('express');
var router = express.Router();
const db = require("../models");


/* GET home page. */
router.get('/', async function (req, res, next) {
    let session = req.session;
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
    res.render('cart', {title: 'Express', session: session, carts: cart});
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
        include: [{
            model: db.Cart,
            as: 'carts',
            on: {
                userid: user.id,
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
    var result;
    if(product.carts.length != 0){
        // product.carts[0].id
        // const cart = await db.Cart.findOne({
        //     where: {
        //         id: product.carts[0].id,
        //     }
        // })
        // cart.amount += 1;
        // result = await cart.save();
    }else{
        const cart = await db.Cart.create({
            userId: user.id,
            amount: 1
        })
        cart.addProducts(product, {
            through: {createAt: new Date(), updateAt: new Date() }
        })
        result = await cart.save();
    }

    console.log(product)
    console.log(product.carts)
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
