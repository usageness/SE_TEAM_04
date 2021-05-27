const Product = require("../models").Product;
const Category = require("../models").Category;


const getProductDetail = async (req,res) => {
  const {
    params: productId
  } =req;
  let session = req.session;

  let product = await Product.findOne({where:{id:req.params.productId}});
  let category =await Category.findOne({where:{id:product.categoryinId}})
  res.render("product_detail", { title: "", session,
data:{
product,
category,
} });
};
module.exports = {getProductDetail};
