const Product = require("../models").Product;
const Category = require("../models").Category;
const db = require("../models");

const getProductDetail = async (req,res) => {
  const {
    params: productId
  } =req;
  let session = req.session;

  let product = await Product.findOne({
    where:{
      id:req.params.productId
    },
    attributes:[
      'id', 'title', 'designer', 'tag', 'imageurl', 'url', 'content', 'price', 'playersMin', 'playersMax', 'playTime', 'difficulty', 'deliveryFee', 'hidden', 'CategoryId', 'uploaderId', 'categoryinId',
      [db.Sequelize.literal('avg(review.score)'), 'avgScore'],
    
    ],
    include:[{
      model: db.Review,
      as: "review"
    }]
  });
  let category = await Category.findOne({where: {id: product.categoryinId}});

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

  res.render("product_detail", {
    title: "",
    session,
    data:{
      product,
      category,
    },
    category: categorylist,
    reviews: reviews,
  });
};
module.exports = {getProductDetail};
