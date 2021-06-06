const Inquiry = require("../models").Inquiry;
const PurchaseLog = require("../models").PurchaseLog;
const User = require("../models").User;
const Product = require("../models").Product;

const getQna = async (req, res) => {
  let session = req.session;
  let logId = req.params.logId;
const inquiry = await Inquiry.findAll({
  where:{
    logId:req.params.logId
  }
})
if(inquiry.length>=1)
{
  res.redirect("/qnaList/"+logId);
} else {
  res.render("qnaResister", {
    session,
    logId,
  });
}
  
};

const getQnaAdd = (req,res) => {
  let session = req.session;
  let logId = req.params.logId;
  res.render("qnaResister", {
    session,
    logId,
  });
}

const postQna = async (req, res) => {
  const {
    body: { title, content },
    params: { logId },
  } = req;
  let session = req.session;

  

  const loginUser = await User.findOne({
    where: {
      user_id: req.session.user_id,
    },
  });

  const userPurchaseLog = await PurchaseLog.findOne({
    where: {
      id: req.params.logId,
    },
  });
  console.log(logId);
  const userProduct = await Product.findOne({
    where: {
      id: userPurchaseLog.productId,
    },
  });

  try {
    const newInquiry = await Inquiry.create({
      title,
      content: "주문번호:" + logId + " 상품명: '" + userProduct.title + "' // " + content,
      date:new Date(),
      Type: 0,
    });

  newInquiry.logId = req.params.logId;
  newInquiry.PurchaseLogId = loginUser.id;
  await newInquiry.save();
  } catch (e) {
    console.log(e);
  }

  
  

  res.redirect("/qnaList/"+logId);
};

const getQnaList = async (req, res) => {
  let session = req.session;
  const loginUser = await User.findOne({
    where: {
      user_id: req.session.user_id,
    },
  });

  const inquiryList = await Inquiry.findAll({
    where: {
      PurchaseLogId: loginUser.id,
      logId:req.params.logId
    },
  });
  let logId = req.params.logId;
  res.render("qnaList", {
    session,
    inquiryList,
    logId
  });
};
module.exports = { getQna, postQna, getQnaList,getQnaAdd };
