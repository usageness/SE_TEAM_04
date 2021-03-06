var express = require('express');
var router = express.Router();
const qs = require('qs') //Using qs for parameters.
const https = require('https') //Using https.


const db = require("../models");



//Put your Admin Key here.
const admin_key = process.env.ADMIN_KEY;

//Setting headers.
const options = {
  hostname: 'kapi.kakao.com',
  path: '/v1/payment/ready',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    'Authorization': `KakaoAK ${admin_key}`
  }
}

router.post('/', async function(req, res, next) {
  let session = req.session;
  var result = false;
  const user = await db.User.findOne({
    where:{
        user_id: req.session.user_id,
    }
  })
  var itemName = ''
  var anotherItemNum = 0;
  var price = 0;
  const cartList = JSON.parse(req.body.cartList);
  console.log(cartList)
  
  
  for (let index = 0; index < cartList.length; index++) {
    const cart = await db.Cart.findOne({
      where: {
        id: cartList[index].id,
        status: 0
      },
      include:[{
        model: db.Product,
        as: 'products',

      }]
    })
    cart.amount = cartList[index].amount;
    cart.status = 1;
    await cart.save();

    if(itemName == ''){
      itemName += cart.products[0].title
    }else{
      anotherItemNum++;
    }
    price += parseInt(cart.products[0].price) * parseInt(cartList[index].amount);
  }
  if(anotherItemNum != 0 ){
    itemName += ' 외 ' + anotherItemNum
  }
  deliveryFee = req.body.deliveryFee;
  var totalAmount = parseInt(price) + parseInt(deliveryFee);

  if(req.body.couponId != ''){ ///121211323
    const coupon = await db.Coupon.findOne({
        where:{
            id: req.body.couponId
        },
        include:[{
            model: db.User,
            as: 'user',
            through: "Coupon_User",
            on:{
                id: user.id,
            }
        }]
    })
    console.log(coupon.user[0].Coupon_User.used)
    if(coupon.user[0].Coupon_User.used != 0){
      res.send('쿠폰을 이미 사용했습니다')
      return;
    }
    if(coupon.type == 1){
      totalAmount -= coupon.discountStatic
    }else{
      if(totalAmount * coupon.discountPercent / 100 >= coupon.maxDiscount){
        totalAmount -= coupon.maxDiscount
      }else{
        totalAmount -= Math.floor(totalAmount * coupon.discountPercent / 100)
      }
    }
    await db.Coupon_User.update({used:1}, {where:{CouponId: coupon.id, UserId: user.id}})
  }
  //Parameters - replace values as you want, **except cid**.
  const data = qs.stringify({
    cid: 'TC0ONETIME',
    partner_order_id: '00000001',
    partner_user_id: 'test_user',
    item_name: itemName,
    quantity: 1,
    total_amount: totalAmount,
    tax_free_amount: totalAmount,
    approval_url: 'http://' + req.headers.host + '/pay/success',
    cancel_url: 'http://' + req.headers.host + '/pay/cancel',
    fail_url: 'http://' + req.headers.host + '/pay/fail'
  })

  //Request
  const _req = https.request(options, _res => {
    console.log(`statusCode: ${_res.statusCode}`)
    _res.on('data', d => {
      process.stdout.write(d)
      const json = JSON.parse(d)
      res.send(`${json.next_redirect_pc_url}`)
    })
  })
  _req.on('error', error => {
    console.error(error)
  })
  
  _req.write(data)
  _req.end()
  result = true;

  if(result){
    // res.sendStatus(200);
  }else{
    res.sendStatus(400);
  }


});

router.get('/success', async (req, res) => {
  console.log(req.headers.host)
  console.log(req.hostname)

  const user = await db.User.findOne({
    where:{
        user_id: req.session.user_id,
    }
  })

  const address = await db.Address.findOne({
    where:{
      userId: user.id,
      isChecked: true
    }
  })
  const carts = await db.Cart.findAll({
    where:{
      userId: user.id,
      status: 1,
    },
    include: [{
      model: db.Product,
      as: 'products',
    }]
  })
  var price = 0
  var deliveryFee = 0
  for (let index = 0; index < carts.length; index++) {
    if(deliveryFee < carts[index].products[0].deliveryFee){
      deliveryFee = carts[index].products[0].deliveryFee
    }
    price += parseInt(carts[index].products[0].price) * parseInt(carts[index].amount);
  }

  const couponUser = await db.Coupon_User.findOne({
    where:{
      used:1, 
      UserId: user.id
    }
  })
  if(couponUser){
    const coupon = await db.Coupon.findOne({
      where: {
        id: couponUser.CouponId
      }
    })
  }
  
  var totalAmount = parseInt(price) + parseInt(deliveryFee);
  
  
    if(typeof coupon !== "undefined"){
      if(coupon.type == 1){
        totalAmount -= parseInt(coupon.discountStatic)
      }else{
        if(totalAmount * parseInt(coupon.discountPercent) / 100 >= parseInt(coupon.maxDiscount)){
          totalAmount -= parseInt(coupon.maxDiscount)
        }else{
          totalAmount -= Math.floor(totalAmount * parseInt(coupon.discountPercent) / 100)
        }
      }
    }
  
  
  
  console.log(totalAmount)
    
  
  var logId = -1;
  for (let i = 0; i < carts.length; i++) {
    const cart = carts[i];
    if(logId == -1){
      const log = await db.PurchaseLog.create({
        date: new Date(),
        count: cart.amount,
        logId: 0,
        amount: totalAmount,
        status: 1,
        addressId: address.id,
        productId: cart.products[0].id,
        userId: user.id,
      })
      log.logId = log.id;
      log.save();
      logId = log.id;
    }else{
      const log = await db.PurchaseLog.create({
        date: new Date(),
        count: cart.amount,
        logId: logId,
        amount: 0,
        status: 1,
        addressId: address.id,
        productId: cart.products[0].id,
        userId: user.id,
      })
    }
    const _cart = await db.Cart.findOne({where:{id:cart.id}})
    _cart.destroy();
    await db.Coupon_User.update({used:2}, {where:{used:1, UserId: user.id}})


  }

  

	res.send(`결제 완료했습니다. 
  <script>
    document.addEventListener("DOMContentLoaded", function(){
      // Handler when the DOM is fully loaded
      alert('결제 완료했습니다.')
      window.opener.location.href = "/order"

      setTimeout(function(){

        window.close()
      }, 1000)
    });
  </script>`)
})
router.get('/cancel', async (req, res) => {
  const user = await db.User.findOne({
    where:{
        user_id: req.session.user_id,
    }
  })
  const carts = await db.Cart.findAll({
    where:{
      userId: user.id,
      status: 1,
    },
    include: [{
      model: db.Product,
      as: 'products',
    }]
  })

  for (let index = 0; index < carts.length; index++) {
    const cart = carts[index];
    const _cart = await db.Cart.findOne({
      where:{
        id: cart.id
      }
    })
    _cart.status = 0;
    _cart.save();
  }
  await db.Coupon_User.update({used:0}, {where:{used:1, UserId: user.id}})


  res.send(`결제 취소했습니다. 
  <script>
    document.addEventListener("DOMContentLoaded", function(){
      // Handler when the DOM is fully loaded
      alert('결제 취소했습니다.')
      window.opener.location.href =  "/cart"

      setTimeout(function(){

        window.close()
      }, 1000)
    });
  </script>`)
})
router.get('/fail', async (req, res) => {
  const user = await db.User.findOne({
    where:{
        user_id: req.session.user_id,
    }
  })
  const carts = await db.Cart.findAll({
    where:{
      userId: user.id,
      status: 1,
    },
    include: [{
      model: db.Product,
      as: 'products',
    }]
  })

  for (let index = 0; index < carts.length; index++) {
    const cart = carts[index];
    const _cart = await db.Cart.findOne({
      where:{
        id: cart.id
      }
    })
    _cart.status = 0;
    _cart.save();
  }
  await db.Coupon_User.update({used:0}, {where:{used:1, UserId: user.id}})

  res.send(`결제 실패했습니다. 
  <script>
    document.addEventListener("DOMContentLoaded", function(){
      // Handler when the DOM is fully loaded
      alert('결제 실패했습니다.')
      window.opener.location.href = "/cart"

      setTimeout(function(){
        window.close()
      }, 1000)
    });
  </script>`)
})

module.exports = router;
