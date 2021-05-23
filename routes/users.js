var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  let session = req.session;
  res.send('respond with a resource', {
    session: session
  });
});

module.exports = router;
