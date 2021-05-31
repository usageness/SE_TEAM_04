var express = require("express");
const fs = require('fs')
var router = express.Router();
const db = require("../../models");
const { isLoggedIn } = require("./middleware");


router
.route("/")
.get( isLoggedIn, async (req, res)=>{

  const coupon = await db.Coupon.findAll();
  res.render("admin_coupon", { coupons: coupon });
})
.post(isLoggedIn, (req, res)=>{

});

router
.route("/newcoupon")
.get( isLoggedIn, async (req, res)=>{

  const coupon = await db.Coupon.findAll();
  var category = await db.Category.findAll();
  res.render("admin_newcoupon", { coupons: coupon, category: category });
})
.post(isLoggedIn, async (req, res)=>{
  var result = false;
  try{
    const name = req.body.name;
    const code = req.body.code;
    const minPrice = req.body.minPrice?req.body.minPrice:null;
    const discountStatic = req.body.discountStatic?req.body.discountStatic:null;
    const discountPercent = req.body.discountPercent?req.body.discountPercent:null;
    const maxDiscount = req.body.maxDiscount?req.body.maxDiscount:null;
    const category = req.body.category?req.body.category:null;
    const type = req.body.type;
    const content = req.body.content;

    const _category = await db.Category.findOne({where:{name: category}})

    const coupon = await db.Coupon.create({
      code: code,
      name: name,
      content: content,
      minPrice: minPrice,
      discountStatic: discountStatic,
      discountPercent: discountPercent,
      maxDiscount: maxDiscount,
      date: new Date(),
      Type: type,
      CategoryId: _category?_category.id:null
    })
    result = true;

  }catch(error){
    console.log(error)
  }
  if(result){
    res.sendStatus(200)

  }else {
    res.sendStatus(400)
  }
});

router
.route("/:couponId")
.get( isLoggedIn, async (req, res)=>{
  console.log(req.params.couponId)
  const coupon = await db.Coupon.findOne({where: {id:req.params.couponId}});
  const category = await db.Category.findAll();
  res.render("admin_coupon_detail", { coupon: coupon, category:category });
})
.post(isLoggedIn, async (req, res)=>{
  var result = false;
  try{
    const name = req.body.name;
    const code = req.body.code;
    const minPrice = req.body.minPrice?req.body.minPrice:null;
    const discountStatic = req.body.discountStatic?req.body.discountStatic:null;
    const discountPercent = req.body.discountPercent?req.body.discountPercent:null;
    const maxDiscount = req.body.maxDiscount?req.body.maxDiscount:null;
    const category = req.body.category?req.body.category:null;
    const type = req.body.type;
    const content = req.body.content;

    const _category = await db.Category.findOne({where:{name: category}})

    const coupon = await db.Coupon.findOne({
      where:{
        id: req.params.couponId
      }
    })
    coupon.code = code,
    coupon.name = name,
    coupon.content = content,
    coupon.minPrice = minPrice,
    coupon.discountStatic = discountStatic,
    coupon.discountPercent = discountPercent,
    coupon.maxDiscount = maxDiscount,
    coupon.date = new Date(),
    coupon.Type = type,
    coupon.CategoryId = _category?_category.id:null

    result = await coupon.save();

  }catch(error){
    console.log(error)
  }
  if(result){
    res.sendStatus(200)

  }else {
    res.sendStatus(400)
  }
});


module.exports = router;
