const Product = require("../models").Product;
const Category = require("../models").Category;
const Address = require("../models").Address;
const User = require("../models").User;
const ProductImage = require("../models").ProductImage;
const db = require("../models");

const getProductDetail = async (req,res) => {
  const {
    params: productId
  } =req;
  let session = req.session;
  let cartCount = 0;

  if (typeof req.session.user_id !== "undefined") {
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

  let product = await Product.findOne({
    where:{
      id:req.params.productId
    },
    attributes:[
      'id', 'title', 'designer', 'tag', 'imageurl', 'url', 'content', 'price', 'playersMin', 'playersMax', 'playTime', 'difficulty', 'deliveryFee', 'hidden', 'CategoryId', 'uploaderId', 'categoryinId',
      [db.Sequelize.literal('avg(Reviews.score)'), 'avgScore'],
    
    ],
    include:[{
      model: db.Review,
    }]
  });
  let category = await Category.findOne({where: {id: product.categoryinId}});
  let productImage = await ProductImage.findAll({where:{ProductId: product.id}});

  let categorylist = await db.Category.findAll({
    attributes: ["id", "name"],
  });

  const reviews = await db.Review.findAll({
    where:{
      ProductId: product.id,
    },
    include:[{
      model: db.User,
      as: 'user'
    }]
  })
  console.log(product)
  console.log(reviews)
  const user = await db.User.findOne({
    where: {
      user_id: !!req.session.user_id ? req.session.user_id : "default"
    }
  });
  const address = await Address.findOne({
    where: {
      userId: user.id?user.id:0,
      isChecked:true
    }
  });
  
  res.render("product_detail", {
    title: "",
    session,
    cartCount: cartCount,
    data:{
      product,
      category,
      productImage,
      address
    },
    category: categorylist,
    reviews: reviews,
  });
};
module.exports = {getProductDetail};
