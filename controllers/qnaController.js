const Inquiry = require("../models").Inquiry;
const PurchaseLog = require("../models").PurchaseLog;
const User = require("../models").User;
const Product = require("../models").Product;
const db = require("../models");

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
  console.log(req.params.logId);
  console.log(req.session);
  console.log("777");
  newInquiry.PurchaseLogId = loginUser.id;

  await newInquiry.save();
  } catch (e) {
    console.log(e);
  }

  
  

  res.redirect("/qnaList/"+logId);
};

const getQnaList = async (req, res) => {
  let session = req.session;
  let logId = req.params.logId;
  const loginUser = await User.findOne({
    where: {
      user_id: req.session.user_id,
    },
  });
  
  const inquiryList = await Inquiry.findAll({
    where: {
    },
    include: [{
      model: db.Inquiry,
      as: "answer"
    }]
  });

  const answerList = await Inquiry.findAll({
    where:{
      Type: 1
    }
  });
 
  res.render("qnaList", {
    session,
    inquiryList,
    answerList,
    logId
  });
};

const getQnaManage = async (req,res) => {
  let session = req.session;
  var inquiryId = req.params.inquiryId;
  const inquiryList = await Inquiry.findAll({
   where: {
     Type:0
   },
   include: [{
    model: db.Inquiry,
    as: "answer"
  }]
  });
  const answerList = await Inquiry.findAll({
    where:{
      Type: 1
    }
  });
  console.log(inquiryList);
  res.render("admin_qnaManage", {
    session,
    inquiryList,
    answerList,
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

  const inquiry = await Inquiry.findOne({
    where: {
      id:inquiryId
    }
  });

  inquiry.inquiryId = answer.id;

  await inquiry.save();
  res.redirect("/admin/qna");
}
const getQnaAnsEnd = async (req,res) => {
  let session = req.session;
  var inquiryId = req.params.inquiryId;
  const inquiry = await Inquiry.findOne({
    where:{
      id:inquiryId
    }
   });
  const answer = await Inquiry.findOne({
    where: {
      Type: 1,
      inquiryId: inquiry.id
    }
  })
   res.render("admin_qnaAnsEnd", {
     session,
     inquiry,
     answer,
     inquiryId
   });
}
module.exports = { getQna, postQna, getQnaList,getQnaAdd ,getQnaManage,getQnaAns,postQnaAns,getQnaAnsEnd};
