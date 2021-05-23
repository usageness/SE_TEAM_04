var express = require('express');
var router = express.Router();

router.get("/", function(req,res,next){
    req.session.destroy();
    res.clearCookie('sid');

    res.redirect("/")
})

module.exports = router;
