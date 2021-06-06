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

const getQnaManage = async (req,res) => {
  let session = req.session;
  var inquiryId = req.params.inquiryId;
  const inquiryList = await Inquiry.findAll({
   
  });
  res.render("admin_qnaManage", {
    session,
    inquiryList,
    inquiryId
  });
}

const getQnaAns = async (req,res) => {
  let session = req.session;
  var inquiryId = req.params.inquiryId;
  console.log("444");
  const inquiry = await Inquiry.findOne({
   where:{
     id:inquiryId
   }
  });
  res.render("admin_qnaAns", {
    session,
    inquiry,
    inquiryId
  });
}

const postQnaAns = async (req,res) => {
  let session = req.session;
  var inquiryId = req.params.inquiryId;
  console.log("666");
  const {
    body:{
      title, content
    }
  } =req;
  const answer = await Inquiry.create({
    title,
    content,
    date: new Date(),
    Type: 1
  });
  answer.inquiryId = inquiryId;
  await answer.save();
}
module.exports = { getQna, postQna, getQnaList,getQnaAdd ,getQnaManage,getQnaAns,postQnaAns};
