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

    users.User.create({
        user_id: body.user_id,
        password: hashPassword,
        nickname: body.nickname,
        permission: 0,
        create_at: Date.now(),
        salt: salt
    })
        .then(result => {
            res.redirect("/");
        })
        .catch(err => {
            console.log(err);
        })
});

module.exports = router;
