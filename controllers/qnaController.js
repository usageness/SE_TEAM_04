const Inquiry = require("../models").Inquiry;
const PurchaseLog = require("../models").PurchaseLog;
const User = require("../models").User;
const Product = require("../models").Product;

const getQna = (req, res) => {
  let session = req.session;
  let logId = req.params.logId;

  res.render("qnaResister", {
    session,
    logId,
  });
};

const postQna = async (req, res) => {
  const {
    body: { title, content },
    params: { logId },
  } = req;
  let session = req.session;

  var date = new Date();
  var year = date.getFullYear();
  var month = ("0" + (1 + date.getMonth())).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);

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
      date: year + "-" + month + "-" + day,
      Type: 0,
    });

  newInquiry.logId = req.params.logId;
  newInquiry.PurchaseLogId = loginUser.id;
  await newInquiry.save();
  } catch (e) {
    console.log(e);
  }

  
  

  res.redirect("/qnaList");
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
    },
  });

  res.render("qnaList", {
    session,
    inquiryList,
  });
};
module.exports = { getQna, postQna, getQnaList };
