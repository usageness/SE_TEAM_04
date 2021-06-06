var express = require('express');
var router = express.Router();
const db = require("../models");


/* GET home page. */
router.get('/', async function (req, res, next) {
    let session = req.session;
    let category = await db.Category.findAll({
        attributes: ["id", "name"],
    });
    if(req.session.user_id == undefined){
        res.send('로그인 후 접속하세요.<br><a href="/">홈으로</a> ')
        return;
    }
    
    const user = await db.User.findOne({where:{user_id: req.session.user_id}})

    var dateMin = new Date()
    var dateMax = new Date()

    dateMin.setDate(dateMin.getDate() - 7)
    if(req.params.dateMin != undefined && req.params.dateMax != undefined){
        var dateMin = new Date(req.query.dateMin.slice(4, 8), (req.query.dateMin.slice(0, 2) - 1), req.query.dateMin.slice(2, 4), 0, 0, 0)
        var dateMax = new Date(req.query.dateMax.slice(4, 8), (req.query.dateMax.slice(0, 2) - 1), req.query.dateMax.slice(2, 4), 23, 59, 59)
        dateMin.setHours(dateMin.getHours() + 9)
        dateMax.setHours(dateMax.getHours() + 9)
    }

    var dMin = (dateMin.getMonth() + 1) + '/' + dateMin.getDate() + '/' + dateMin.getFullYear();
    var dMax = (dateMax.getMonth() + 1) + '/' + dateMax.getDate() + '/' + dateMax.getFullYear();

    
    var logs = await db.PurchaseLog.findAll({
        where: {
            date: {
                [db.Sequelize.Op.gte]: dateMin,
                [db.Sequelize.Op.lte]: dateMax
            },
            userId: user.id
        
        },
        attributes: [
        "id", "date", "count", "status", 'amount', 'count', 'logId', 'productId', 
        [db.Sequelize.literal('SUM(`amount`)'), 'amountAll'],
        [db.Sequelize.fn('COUNT', db.Sequelize.col('purchaselog.id')), 'productsCount'],
        ],
        include:[
        {
            model: db.Product,
            as: 'purchase',
            attributes: ['id', 'title']
        },{
            model: db.Address,
            as: "destination",
        }
        ],
        group: ['logId']
    });
    // console.log(logs)
    res.render("order", { title: 'Express', session: session, category: category,logs: logs, dateMin: dMin, dateMax: dMax});
});

router.put('/', async function (req, res, next) {
    const logId = req.body.logId;
    const currentStatus = req.body.currentStatus;
    const targetStatus = req.body.targetStatus;
    const log = await db.PurchaseLog.findOne({
        where: {
        logId: logId,
        }
    })
    // console.log(log.status)
    // console.log(currentStatus)
    // console.log(targetStatus)

    var result = false;
    if(currentStatus == 3 && log.status == 3 && targetStatus == 4){
        result = await db.PurchaseLog.update({status: 4},{where:{logId: logId}});
    }

    if(result){
        res.sendStatus(200);
    }else{
        res.sendStatus(400);
    }
})

module.exports = router;
