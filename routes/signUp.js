var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const users = require("../models");

/* GET signUp page. */
router.get('/', function (req, res, next) {
    res.render('signUp', {title: 'Express'});
});

/* POST signUp request. */
router.post('/', function (req, res, next) {
    let body = req.body;

    let inputPassword = body.password;
    let salt = Math.round((new Date().valueOf() * Math.random())) + "";
    let hashPassword = crypto.createHash("sha256").update(inputPassword + salt).digest("hex");

    users.User.findOne({
        where: {
            user_id: body.user_id
        }
    }).then((existCheck) => {
        if (existCheck === null) {
            users.User.create({
                user_id: body.user_id,
                password: hashPassword,
                nickname: body.nickname,
                permission: 0,
                create_at: Date.now(),
                salt: salt
            })
                .then(result => {
                    res.send('<script type="text/javascript">alert("회원가입이 완료되었습니다."); location.href = "/";</script>');
                })
                .catch(err => {
                    console.log(err);
                })
        }
        else
        {
            res.send('<script type="text/javascript">alert("중복된 아이디입니다"); location.href = "/signUp";</script>');
        }
    });

});

module.exports = router;
