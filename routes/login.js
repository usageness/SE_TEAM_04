var express = require('express');
var router = express.Router();
const users = require("../models");
const crypto = require('crypto');

/* GET home page. */
router.get('/', function (req, res, next) {
    let session = req.session;

    res.render('login', {
        title: 'Express',
        session: session
    });
});

router.post("/", async function(req,res,next) {
    let body = req.body;

    let result = await users.User.findOne({
        where: {
            user_id: body.user_id
        }
    });

        if (result !== null) {
            let dbPassword = result.dataValues.password;
            let inputPassword = body.password;
            let salt = result.dataValues.salt;
            let hashPassword = crypto.createHash("sha256").update(inputPassword + salt).digest("hex");

            if (dbPassword === hashPassword) {
                console.log("비밀번호 일치");
                req.session.user_id = body.user_id;
                req.session.nickname = result.dataValues.nickname;
                req.session.permission = result.dataValues.permission;
                console.log("유저의 퍼미션 : " + result.dataValues.permission);
                if(result.dataValues.permission === 1) res.redirect("/admin");
                else res.redirect("/");
            }

        }else {
            console.log("비밀번호 불일치");
            res.send('<script type="text/javascript">alert("아이디 또는 비밀번호가 일치하지 않습니다"); location.href = "/login";</script>');
        }
});

module.exports = router;
