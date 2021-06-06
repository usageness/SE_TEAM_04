var express = require("express");
const fs = require('fs')
var router = express.Router();
const db = require("../../models");
const { isLoggedIn } = require("./middleware");


router
.route("/:logId")
.get( isLoggedIn, async (req, res)=>{
  const logId = req.params.logId
  const logs = await db.PurchaseLog.findAll({
    where: {
      logId: logId
    },
    include:[
      {
        model: db.Review,
        as:'reviews',
      },
      {
        model: db.Product,
        as:'purchase',
      },
      {
        model: db.User,
        as:'log',
      },

    ]
  });
  res.render("admin_review", { logs: logs });
})
.post(isLoggedIn, (req, res)=>{
  res.sendStatus(404)
});


module.exports = router;
