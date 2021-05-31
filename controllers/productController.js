const Product = require("../models").Product;
const Category = require("../models").Category;
const db = require("../models");

const getProductDetail = async (req,res) => {
  const {
    params: productId
  } =req;
  let session = req.session;

  let product = await Product.findOne({where:{id:req.params.productId}});
  let category = await Category.findOne({where: {id: product.categoryinId}});

  let categorylist = await db.Category.findAll({
    attributes: ["id", "name"],
  });

  res.render("product_detail", {
    title: "",
    session,
    data:{
      product,
      category,
    },
    category: categorylist,
  });
};
module.exports = {getProductDetail};
