const Product = require("../models").Product;

const getProductDetail = async (req,res) => {
  const {
    params: productId
  } =req;
  let session = req.session;

  let product = await Product.findOne({where:{id:productId}});

  res.render("product_detail", { title: "", session,
data:{
product
} });
};
module.exports = {getProductDetail};
