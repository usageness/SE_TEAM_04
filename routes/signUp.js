var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const db = require("../models");

/* GET signUp page. */
router.get('/', async function (req, res, next) {
    let session = req.session;
    let cartCount = 0;

    let category = await db.Category.findAll({
        attributes: ["id", "name"],
    });

    if (req.session.user_id !== undefined) {
        const user = await db.User.findOne({
            where: {
                user_id: req.session.user_id,
            }
        });

        cartCount = await db.Cart.count({
            where: {
                userId: user.id
            }
        });
    }

    res.render('signUp', {
        title: 'Express',
        session: session,
        category: category,
        cartCount: cartCount
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
                        res.send('<script type="text/javascript">alert("??????????????? ?????????????????????"); location.href = "/";</script>');
                    }).catch(() => {
                        res.send('<script type="text/javascript">alert("????????? ??????????????????"); location.href = "/signUp";</script>');
                    });
                }else{
                    res.send('<script type="text/javascript">alert("????????? ??????????????????"); location.href = "/signUp";</script>');
                }
            })
        }else{
            res.send('<script type="text/javascript">alert("????????? ??????????????????"); location.href = "/signUp";</script>');
        }
    })
});

module.exports = router;
