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
        res.sendStatus(400)
        return;
    }

    const user = await db.User.findOne({
        where:{
            user_id: req.session.user_id,
        },
        include: [{
            model: db.Coupon,
            as: 'coupon',
            through:'Coupon_User',
            where:{
                'Coupon_User.used': 0,
            },
            include:[{
                model: db.Category
            }]
        }]
    })

    res.json({coupons: coupon});
});
/* GET home page. */
router.get('/:coupon_code', async function (req, res, next) {
    let session = req.session;
    
    if(req.session.user_id == undefined){
        res.sendStatus(400)
        return;
    }
    const coupon = await db.Coupon.findOne({
        where: {
            code: req.params.coupon_code
        }
    })
    if(!coupon){
        res.send("존재하지 않는 쿠폰입니다.<br><a href='/'>홈으로</a> ")
        return;
    }
    const user = await db.User.findOne({
        where:{
            user_id: req.session.user_id,
        },
    })
    const _user = await db.User.findOne({
        where:{
            user_id: req.session.user_id,
        },
        include: [{
            model: db.Coupon,
            as: 'coupon',
            through:'Coupon_User',
            where:{
                id: coupon.id,
            },
        }]
    })
    console.log(coupon.id)
    console.log(user.id)
    // console.log(_user.coupon)
    if(!_user){
        try {
            await db.Coupon_User.create({
                UserId: user.id,
                CouponId: coupon.id,
            })
        } catch (error) {
            console.log(error)
            res.send("오류가 발생했습니다.<br><a href='/'>홈으로</a> ")
            return;
        }
        
        res.send("쿠폰을 받았습니다.<br><a href='/'>홈으로</a> ")
    }else{
        res.send("이미 쿠폰을 받았습니다.<br><a href='/'>홈으로</a> ")
    }
});

// router.post('/', async function (req, res, next) {
//     let session = req.session;
//     if(req.session.user_id == undefined){
//         res.sendStatus('400')
//         return;
//     }
    

//     const user = await db.User.findOne({
//         where:{
//             user_id: req.session.user_id,
//         },
//     })

//     const product = await db.Product.findOne({
//         where:{
//             id : req.body.itemId,
//         },
//     })
//     const cart = await db.Cart.findOne({
//         where: {
//             userId: user.id,
//             status: 0,
//         },
//         include: [{
//             model: db.Product,
//             as: 'products',
//             where: {
//                 id: req.body.itemId,
//             } 
//         }]
//     })
//     // const cart = await db.Cart.findOne({
//     //     where: {
//     //         userId: user.id,
//     //     },
//     //     include: [{
//     //         model: db.Product,
//     //         as: 'products',
//     //         on: {
//     //             id: req.body.itemId,
//     //         } 
//     //     }]
//     // })
//     console.log(product)
//     console.log(cart)
//     var result;
//     if(cart != null){
//         // product.carts[0].id
//         // const cart = await db.Cart.findOne({
//         //     where: {
//         //         id: product.carts[0].id,
//         //     }
//         // })
//         // cart.amount += 1;
//         // result = await cart.save();
//         res.sendStatus(300);
//         return;
//     }else{
//         const _cart = await db.Cart.create({
//             userId: user.id,
//             amount: 1
//         })
//         _cart.addProducts(product, {
//             through: {createAt: new Date(), updateAt: new Date() }
//         })
//         result = await _cart.save();
//     }

//     // console.log(product)
//     // console.log(product.carts)
//     // console.log(cart.products)
//     // res.render('cart', {title: 'Express', session: session, carts: cart});
//     if(result){
//         res.sendStatus(200);
//     }else{
//         res.sendStatus(400);

//     }
// });

// router.delete('/', async function (req, res, next) {
//     let session = req.session;
//     if(req.session.user_id == undefined){
//         res.sendStatus('400')
//         return;
//     }
//     var result = true;

//     const user = await db.User.findOne({
//         where:{
//             user_id: req.session.user_id,
//         },
//     })

//     var cartList = req.body.cartList;
//     var cart;
//     for(var i = 0; i < cartList.length; i++){
//         cart = await db.Cart.findOne({
//             where: {
//                 id: cartList[i]
//             }
//         })
//         await cart.destroy()
//     }
   

//     if(result){
//         res.sendStatus(200);
//     }else{
//         res.sendStatus(400);

//     }
// });

module.exports = router;
