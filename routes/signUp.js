var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const db = require("../models");

/* GET signUp page. */
router.get('/', async function (req, res, next) {
    let session = req.session;
    let category = await db.Category.findAll({
        attributes: ["id", "name"],
    });
    res.render('signUp', {
        title: 'Express',
        session: session,
        category: category
    });
});

/* POST signUp request. */
router.post('/', function (req, res, next) {
    let body = req.body;

    let inputPassword = body.password;
    let salt = Math.round((new Date().valueOf() * Math.random())) + "";
    let hashPassword = crypto.createHash("sha256").update(inputPassword + salt).digest("hex");

    let existCheckId =
        db.User.findOne({
            where: {
                user_id: body.user_id
            }
        });

    let existCheckEmail =
        db.User.findOne({
            where: {
                email: body.email
            }
        });

    existCheckId.then((result) => {
        if(!result) {
            existCheckEmail.then((result) => {
                if(!result) {
                    db.User.create({
                        user_id: body.user_id,
                        password: hashPassword,
                        nickname: body.nickname,
                        email: body.email,
                        permission: 0,
                        create_at: Date.now(),
                        salt: salt
                    }).then(() => {
                        req.session.user_id = body.user_id;
                        req.session.nickname = body.nickname;
                        res.send('<script type="text/javascript">alert("회원가입이 완료되었습니다"); location.href = "/";</script>');
                    }).catch(() => {
                        res.send('<script type="text/javascript">alert("오류가 발생했습니다"); location.href = "/signUp";</script>');
                    });
                }else{
                    res.send('<script type="text/javascript">alert("중복된 이메일입니다"); location.href = "/signUp";</script>');
                }
            })
        }else{
            res.send('<script type="text/javascript">alert("중복된 아이디입니다"); location.href = "/signUp";</script>');
        }
    })
});

module.exports = router;
